using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace AuthExample.Backend.Endpoints;

public static class WeatherEndpoints
{
    public static void MapWeatherEndpoints(this IEndpointRouteBuilder app)
    {
        var summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        // Protected weather endpoint
        app.MapGet("/weather", (HttpContext context) =>
        {
            WeatherForecast forecast = new (DateOnly.FromDateTime(DateTime.Now), 20, "Mild");
            return Results.Ok(forecast);
        })
        .RequireAuthorization()
        .WithName("GetWeatherForecastForTheDay")
        .WithOpenApi()
        .WithSummary("Get weather forecast (requires authentication)")
        .WithDescription("Returns today's weather forecast. Requires a valid JWT token.");

        app.MapGet("/weatherforecast", (HttpContext context) =>
        {
            var forecast = Enumerable.Range(1, 5).Select(index =>
                new WeatherForecast
                (
                    DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
                    Random.Shared.Next(-20, 55),
                    summaries[Random.Shared.Next(summaries.Length)]
                ))
                .ToArray();
            return Results.Ok(forecast);
        })
        .RequireAuthorization()
        .WithName("GetWeatherForecast")
        .WithOpenApi()
        .WithSummary("Get weather forecast (requires authentication)")
        .WithDescription("Returns a 5-day weather forecast. Requires a valid JWT token.");

        // Protected user info endpoint
        app.MapGet("/user", (HttpContext context) =>
        {
            var user = context.User;
            // Try to get the name from Identity.Name, else from the 'name' claim
            var name = user.Identity?.Name;
            if (string.IsNullOrEmpty(name))
            {
                name = user.Claims.FirstOrDefault(c => c.Type == "name")?.Value;
            }
            return Results.Ok(new
            {
                IsAuthenticated = user.Identity?.IsAuthenticated ?? false,
                Name = name,
                Claims = user.Claims.Select(c => new { Type = c.Type, Value = c.Value })
            });
        })
        .RequireAuthorization()
        .WithName("GetUserInfo")
        .WithOpenApi()
        .WithSummary("Get current user information (requires authentication)")
        .WithDescription("Returns information about the authenticated user including claims.");  
    }
}

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}