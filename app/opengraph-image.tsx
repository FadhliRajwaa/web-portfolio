import { ImageResponse } from "next/og";

export const alt = "Fadhli Rajwaa Rahmana, Full Stack Developer";
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
          justifyContent: "space-between",
          backgroundColor: "#eeebe3",
          padding: "68px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 38, height: 1, backgroundColor: "#0f4fd1" }} />
          <div
            style={{
              fontSize: 17,
              letterSpacing: "0.16em",
              color: "#0f4fd1",
              textTransform: "uppercase",
            }}
          >
            Backend .NET / Full Stack
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 118,
              fontWeight: 700,
              letterSpacing: "-0.045em",
              lineHeight: 0.92,
              color: "#12161a",
            }}
          >
            Fadhli Rajwaa
          </div>
          <div
            style={{
              marginTop: 26,
              fontSize: 27,
              color: "#3a4046",
              maxWidth: 800,
              lineHeight: 1.4,
            }}
          >
            43 modul parameter perbankan di SAMCO, PACS radiologi dengan viewer
            3D, dan SIMRS 33 modul.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid #cfc8b9",
            paddingTop: 20,
            fontSize: 19,
            color: "#5e666d",
          }}
        >
          <div>fadhlirajwaarahmana@gmail.com</div>
          <div>github.com/FadhliRajwaa</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
