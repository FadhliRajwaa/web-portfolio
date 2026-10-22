import { ImageResponse } from "next/og";

export const alt = "Fadhli Rajwaa Rahmana - Full Stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 40,
          backgroundColor: "#eeebe3",
          padding: "72px 80px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* A single instrument-blue rule carries the brand without decoration. */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 8,
            height: "100%",
            backgroundColor: "#0f4fd1",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 36, height: 1, backgroundColor: "#0f4fd1" }} />
          <div
            style={{
              fontSize: 17,
              letterSpacing: "0.16em",
              color: "#0f4fd1",
              textTransform: "uppercase",
            }}
          >
            Full Stack Developer
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 104,
              fontWeight: 700,
              letterSpacing: "-0.045em",
              lineHeight: 0.94,
              color: "#12161a",
            }}
          >
            Fadhli Rajwaa
          </div>
          <div
            style={{
              marginTop: 22,
              fontSize: 25,
              color: "#3a4046",
              maxWidth: 880,
              lineHeight: 1.45,
            }}
          >
            43 modul parameter perbankan, PACS radiologi dengan viewer DICOM 3D,
            dan SIMRS 33 modul.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #cfc8b9",
            paddingTop: 22,
            fontSize: 18,
            color: "#5e666d",
          }}
        >
          <div>fadhliportfolio.my.id</div>
          <div style={{ display: "flex", gap: 26 }}>
            <span>.NET / C#</span>
            <span>React</span>
            <span>PostgreSQL</span>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
