from pydantic import BaseModel

class AlertData(BaseModel):
    alert_type: str
    location: str
    reason: str
    start_time: str
    end_time: str
