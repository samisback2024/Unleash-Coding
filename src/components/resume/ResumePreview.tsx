import { forwardRef } from "react";
import type { ResumeData } from "@/services/resume";

interface Props {
  data: ResumeData;
  template: "modern" | "minimal" | "classic";
}

export const ResumePreview = forwardRef<HTMLDivElement, Props>(
  ({ data, template }, ref) => {
    const {
      personalInfo: p,
      experience,
      education,
      skills,
      projects,
      certifications,
    } = data;

    const styles = {
      modern: {
        header: "bg-[#6c63ff] text-white px-8 py-6",
        name: "text-3xl font-bold",
        accent: "#6c63ff",
        section: "border-l-4 border-[#6c63ff] pl-4",
        sectionTitle:
          "text-sm font-bold uppercase tracking-widest text-[#6c63ff] mb-2",
      },
      minimal: {
        header: "border-b-2 border-gray-800 px-8 py-6",
        name: "text-3xl font-light tracking-wide text-gray-900",
        accent: "#374151",
        section: "mt-1",
        sectionTitle:
          "text-xs font-bold uppercase tracking-widest text-gray-500 border-b border-gray-200 pb-1 mb-3",
      },
      classic: {
        header: "bg-gray-800 text-white px-8 py-6",
        name: "text-3xl font-bold tracking-tight",
        accent: "#374151",
        section: "mt-1",
        sectionTitle:
          "text-sm font-bold uppercase tracking-widest text-gray-700 mb-2 pb-1 border-b border-gray-300",
      },
    }[template];

    const isLight = template !== "modern";

    return (
      <div
        ref={ref}
        id="resume-preview"
        className="bg-white text-gray-800 font-sans"
        style={{
          width: "780px",
          minHeight: "1100px",
          fontFamily: "'Arial', sans-serif",
        }}
      >
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.name} style={isLight ? {} : { color: "white" }}>
            {p.name || "Your Name"}
          </h1>
          <div
            className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm"
            style={{ color: isLight ? "#4b5563" : "rgba(255,255,255,0.85)" }}
          >
            {p.email && <span>{p.email}</span>}
            {p.phone && <span>{p.phone}</span>}
            {p.location && <span>{p.location}</span>}
            {p.linkedin && <span>{p.linkedin}</span>}
            {p.github && (
              <span>github.com/{p.github.replace(/.*github\.com\//, "")}</span>
            )}
            {p.website && <span>{p.website}</span>}
          </div>
        </div>

        <div className="px-8 py-6 space-y-6">
          {/* Summary */}
          {p.summary && (
            <div>
              <h2 className={styles.sectionTitle}>Summary</h2>
              <p className="text-sm text-gray-700 leading-relaxed">
                {p.summary}
              </p>
            </div>
          )}

          {/* Skills */}
          {(skills.technical.length > 0 ||
            skills.languages.length > 0 ||
            skills.tools.length > 0) && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Skills</h2>
              <div className="space-y-1 text-sm text-gray-700">
                {skills.technical.length > 0 && (
                  <p>
                    <strong>Technical:</strong> {skills.technical.join(", ")}
                  </p>
                )}
                {skills.languages.length > 0 && (
                  <p>
                    <strong>Languages:</strong> {skills.languages.join(", ")}
                  </p>
                )}
                {skills.tools.length > 0 && (
                  <p>
                    <strong>Tools:</strong> {skills.tools.join(", ")}
                  </p>
                )}
                {skills.soft.length > 0 && (
                  <p>
                    <strong>Soft Skills:</strong> {skills.soft.join(", ")}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Experience</h2>
              <div className="space-y-4">
                {experience.map((e) => (
                  <div key={e.id}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">
                          {e.position}
                        </p>
                        <p className="text-sm text-gray-600">{e.company}</p>
                      </div>
                      <p className="text-xs text-gray-500 shrink-0 ml-2">
                        {e.startDate} – {e.current ? "Present" : e.endDate}
                      </p>
                    </div>
                    {e.bullets.filter(Boolean).length > 0 && (
                      <ul className="mt-1.5 space-y-0.5 list-disc list-inside text-sm text-gray-700">
                        {e.bullets.filter(Boolean).map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Projects</h2>
              <div className="space-y-3">
                {projects.map((proj) => (
                  <div key={proj.id}>
                    <div className="flex items-start justify-between">
                      <p className="font-semibold text-gray-900 text-sm">
                        {proj.name}
                      </p>
                      {proj.link && (
                        <span className="text-xs text-gray-500 ml-2">
                          {proj.link}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 mt-0.5">
                      {proj.description}
                    </p>
                    {proj.technologies.length > 0 && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        <strong>Tech:</strong> {proj.technologies.join(", ")}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Education</h2>
              <div className="space-y-3">
                {education.map((ed) => (
                  <div key={ed.id} className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        {ed.school}
                      </p>
                      <p className="text-sm text-gray-600">
                        {ed.degree}
                        {ed.field ? `, ${ed.field}` : ""}
                        {ed.gpa ? ` · GPA: ${ed.gpa}` : ""}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 shrink-0 ml-2">
                      {ed.startDate} – {ed.endDate}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Certifications</h2>
              <div className="space-y-1">
                {certifications.map((cert) => (
                  <div key={cert.id} className="flex justify-between text-sm">
                    <span className="text-gray-800 font-medium">
                      {cert.name} ·{" "}
                      <span className="font-normal text-gray-600">
                        {cert.issuer}
                      </span>
                    </span>
                    <span className="text-gray-500 text-xs">{cert.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  },
);

ResumePreview.displayName = "ResumePreview";
