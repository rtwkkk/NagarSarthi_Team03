from openai import OpenAI

client = OpenAI()

def generate_civic_alert(alert: dict) -> str:
    prompt = f"""
Alert type: {alert['alert_type']}
Location: {alert['location']}
Reason: {alert['reason']}
Start time: {alert['start_time']}
End time: {alert['end_time']}
"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a smart city civic alert generator. "
                    "Generate ONE short, clear public alert. "
                    "Maximum 20 words. "
                    "No explanations. No options."
                )
            },
            {"role": "user", "content": prompt}
        ],
        temperature=0.2,
        max_tokens=40
    )

    return response.choices[0].message.content.strip().split("\n")[0]
