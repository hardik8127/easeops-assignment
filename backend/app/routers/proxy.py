import urllib.request
from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import StreamingResponse

router = APIRouter(prefix="/proxy", tags=["proxy"])


@router.get("/pdf")
def proxy_pdf(url: str = Query(..., description="PDF URL to proxy")):
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        resp = urllib.request.urlopen(req, timeout=15)
        content_type = resp.headers.get("Content-Type", "application/pdf")

        def stream():
            while chunk := resp.read(8192):
                yield chunk

        return StreamingResponse(
            stream(),
            media_type=content_type,
            headers={"Access-Control-Allow-Origin": "*"},
        )
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Failed to fetch PDF: {e}")
