from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import energy, summary, zones, ai_context, report

app = FastAPI(title="Smart Energy Analytics API")

#app.add_middleware(
#    CORSMiddleware,
#    allow_origins=["*"],
#    allow_methods=["*"],
#    allow_headers=["*"],
#)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://smart-energy-analytics-platform.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "Smart Energy Analytics API is running"}


app.include_router(energy.router)
app.include_router(summary.router)
app.include_router(zones.router)
app.include_router(ai_context.router)
app.include_router(report.router)