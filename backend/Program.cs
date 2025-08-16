using AuthExample.Backend.Endpoints;
using Microsoft.AspNetCore.Authentication.JwtBearer;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "Weather API",
        Version = "v1",
        Description = "A weather API with Auth0 JWT authentication"
    });

    // Add JWT Authentication to Swagger
    options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Enter 'Bearer' [space] and then your token in the text input below.",
        Name = "Authorization",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

// Add Auth0 JWT Bearer authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        // Auth0 domain should be like: https://dev-xxxx.eu.auth0.com/
        options.Authority = builder.Configuration["AUTH0_DOMAIN"];
        options.Audience = builder.Configuration["AUTH0_AUDIENCE"];
        options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
        {
            NameClaimType = "name",
            RoleClaimType = "role"
        };
    });

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        // Use frontend origin from config or default to http://localhost:3000
        var allowedOrigin = builder.Configuration["FRONTEND_ORIGIN"] ?? "http://localhost:3000";
        policy.WithOrigins(allowedOrigin)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.Services.AddAuthorization(options =>
{
    // Default policy requires authentication
    options.FallbackPolicy = options.DefaultPolicy;
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "Weather API v1");
        options.RoutePrefix = string.Empty; // Serve Swagger UI at the app's root
        options.DocumentTitle = "Weather API - Auth0 Integration";
        options.DisplayOperationId();
        options.DisplayRequestDuration();
        
        // Add custom CSS for better appearance
        options.InjectStylesheet("/swagger-ui/custom.css");
        
        // Add instructions for Auth0 authentication
        options.HeadContent = @"
            <style>
                .swagger-ui .info .title { color: #2878f7ff; }
                .auth-instructions { 
                    background: #f8fafc; 
                    border: 1px solid #e2e8f0; 
                    border-radius: 6px; 
                    padding: 16px; 
                    margin: 16px 0; 
                }
            </style>
            <div class='auth-instructions'>
                <h4>🔐 Authentication Instructions:</h4>
                <ol>
                    <li>Get a JWT token from your Auth0 application</li>
                    <li>Click the 'Authorize' button below</li>
                    <li>Enter 'Bearer YOUR_JWT_TOKEN' in the value field</li>
                    <li>Click 'Authorize' to apply the token to all requests</li>
                </ol>
                <p><strong>Auth0 Domain:</strong> " + builder.Configuration["AUTH0_DOMAIN"] + @"</p>
                <p><strong>API Audience:</strong> " + builder.Configuration["AUTH0_AUDIENCE"] + @"</p>
            </div>";
    });
}

// Serve static files for custom CSS
app.UseStaticFiles();

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();

// Public health endpoint
app.MapGet("/health", () => Results.Ok(new
{
    Status = "Healthy",
    Timestamp = DateTime.UtcNow,
    Version = "1.0.0"
}))
.WithName("HealthCheck")
.WithOpenApi()
.WithSummary("Health Check Endpoint")
.WithDescription("Returns the health status of the API.");

WeatherEndpoints.MapWeatherEndpoints(app);

app.Run();


