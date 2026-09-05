// import { useEffect, useState } from "react";

// const KEY = import.meta.env.VITE_TMDB_KEY;
// const BASE_URL = "https://api.themoviedb.org/3";
// const IMG_SM = "https://image.tmdb.org/t/p/w200";
// const IMG_LG = "https://image.tmdb.org/t/p/w500";

// // ── Helpers ──────────────────────────────────────────────────────────────────
// const Row = ({ label, value }) => value ? (
//   <p style={{ margin: "0.25rem 0", fontSize: "0.82rem" }}>
//     <span style={{ color: "#f5c518" }}>{label}: </span>
//     <span style={{ color: "#ccc" }}>{value}</span>
//   </p>
// ) : null;

// const SectionBlock = ({ title, children }) => (
//   <div style={{ marginBottom: "1.4rem", marginTop: "200px" }}>
//     <p style={{ color: "#f5c518", fontWeight: "bold", marginBottom: "0.6rem", fontSize: "0.95rem", borderBottom: "1px solid #2a2a2a", paddingBottom: "0.3rem" }}>
//       {title}
//     </p>
//     {children}
//   </div>
// );

// const Badge = ({ text, bg = "#f5c518", color = "#111" }) => (
//   <span style={{ background: bg, color, padding: "0.2rem 0.7rem", borderRadius: "999px", fontSize: "0.78rem", fontWeight: "bold" }}>
//     {text}
//   </span>
// );

// const Tag = ({ text }) => (
//   <span style={{ background: "#222", color: "#aaa", padding: "0.15rem 0.5rem", borderRadius: "4px", fontSize: "0.75rem", border: "1px solid #333" }}>
//     {text}
//   </span>
// );

// const PersonChip = ({ person, sub }) => (
//   <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "#2a2a2a", borderRadius: "8px", padding: "0.4rem 0.6rem", fontSize: "0.78rem", minWidth: "140px" }}>
//     {person.profile_path
//       ? <img src={`${IMG_SM}${person.profile_path}`} style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
//       : <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#444", display: "flex", alignItems: "center", justifyContent: "center", color: "#888", flexShrink: 0 }}>👤</div>
//     }
//     <div style={{ overflow: "hidden" }}>
//       <p style={{ color: "#fff", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{person.name}</p>
//       {sub && <p style={{ color: "#888", margin: 0, fontSize: "0.7rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{sub}</p>}
//     </div>
//   </div>
// );

// // ── Pagination ───────────────────────────────────────────────────────────────
// const PagBtn = ({ label, onClick, disabled, active }) => (
//   <button onClick={onClick} disabled={disabled} style={{
//     background: active ? "#f5c518" : disabled ? "#222" : "#2a2a2a",
//     color: active ? "#111" : disabled ? "#444" : "#fff",
//     border: "1px solid #333", borderRadius: "4px",
//     padding: "0.3rem 0.6rem", cursor: disabled ? "not-allowed" : "pointer",
//     fontWeight: active ? "bold" : "normal", minWidth: "2rem",
//   }}>{label}</button>
// );

// const Pagination = ({ page, totalPages, onPageChange }) => {
//   const pages = [];
//   for (let i = Math.max(1, page - 2); i <= Math.min(totalPages, page + 2); i++) pages.push(i);
//   return (
//     <div style={{ display: "flex", gap: "0.4rem", alignItems: "center", flexWrap: "wrap", margin: "1rem 0" }}>
//       <PagBtn label="«" disabled={page === 1} onClick={() => onPageChange(1)} />
//       <PagBtn label="‹" disabled={page === 1} onClick={() => onPageChange(page - 1)} />
//       {pages.map(p => <PagBtn key={p} label={p} onClick={() => onPageChange(p)} active={p === page} />)}
//       <PagBtn label="›" disabled={page === totalPages} onClick={() => onPageChange(page + 1)} />
//       <PagBtn label="»" disabled={page === totalPages} onClick={() => onPageChange(totalPages)} />
//       <span style={{ color: "#888", fontSize: "0.8rem", marginLeft: "0.5rem" }}>Page {page} of {totalPages?.toLocaleString()}</span>
//     </div>
//   );
// };

// // ── Modal ────────────────────────────────────────────────────────────────────
// const Modal = ({ id, type, onClose }) => {
//   const [details, setDetails] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Fetch EVERYTHING available from TMDB in one call
//     const appendAll = [
//       "credits",
//       "images",
//       "videos",
//       "keywords",
//       "recommendations",
//       "similar",
//       "reviews",
//       "external_ids",
//       "watch/providers",
//       type === "movie" ? "release_dates" : "content_ratings",
//       type === "movie" ? "alternative_titles" : "alternative_titles",
//       "translations",
//     ].join(",");

//     fetch(`${BASE_URL}/${type}/${id}?api_key=${KEY}&append_to_response=${appendAll}&include_image_language=en,null`)
//       .then(res => res.json())
//       .then(json => setDetails(json))
//       .finally(() => setLoading(false));
//   }, [id, type]);

//   const handleBackdrop = (e) => { if (e.target === e.currentTarget) onClose(); };

//   return (
//     <div onClick={handleBackdrop} style={{
//       position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)",
//       zIndex: 1000, display: "flex", justifyContent: "center",
//       alignItems: "flex-start", overflowY: "auto", padding: "2rem 1rem",
//     }}>
//       <div style={{ background: "#1a1a1a", borderRadius: "12px", maxWidth: "860px", width: "100%", padding: "2rem", position: "relative" }}>

//         <button onClick={onClose} style={{
//           position: "absolute", top: "1rem", right: "1rem",
//           background: "#333", color: "#fff", border: "none",
//           borderRadius: "50%", width: "2rem", height: "2rem",
//           cursor: "pointer", fontSize: "1rem",
//         }}>✕</button>

//         {loading ? (
//           <p style={{ color: "#888", textAlign: "center", padding: "3rem" }}>Loading all details...</p>
//         ) : !details ? (
//           <p style={{ color: "red" }}>Failed to load.</p>
//         ) : (
//           <>
//             {/* ── 1. HERO ── */}
//             <div style={{ display: "flex", gap: "1.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
//               {details.poster_path && (
//                 <img src={`${IMG_LG}${details.poster_path}`} alt={details.title || details.name}
//                   style={{ width: "160px", borderRadius: "8px", flexShrink: 0 }} />
//               )}
//               <div style={{ flex: 1 }}>
//                 <h2 style={{ color: "#fff", marginBottom: "0.3rem" }}>{details.title || details.name}</h2>
//                 {details.original_title && details.original_title !== details.title &&
//                   <p style={{ color: "#888", fontSize: "0.85rem", marginBottom: "0.3rem" }}>Original: {details.original_title || details.original_name}</p>}
//                 {details.tagline && <p style={{ color: "#aaa", fontStyle: "italic", fontSize: "0.85rem", marginBottom: "0.6rem" }}>"{details.tagline}"</p>}

//                 <Row label="⭐ Rating"       value={`${details.vote_average?.toFixed(1)} / 10 (${details.vote_count?.toLocaleString()} votes)`} />
//                 <Row label="👍 Popularity"   value={details.popularity?.toFixed(1)} />
//                 <Row label="📅 Release"      value={details.release_date || details.first_air_date} />
//                 <Row label="📅 Last Air"     value={details.last_air_date} />
//                 <Row label="⏱ Runtime"      value={details.runtime ? `${details.runtime} min` : details.episode_run_time?.[0] ? `${details.episode_run_time[0]} min/ep` : null} />
//                 <Row label="📺 Seasons"      value={details.number_of_seasons ? `${details.number_of_seasons} seasons` : null} />
//                 <Row label="🎞 Episodes"     value={details.number_of_episodes ? `${details.number_of_episodes} episodes` : null} />
//                 <Row label="📡 Status"       value={details.status} />
//                 <Row label="🌐 Language"     value={details.original_language?.toUpperCase()} />
//                 <Row label="🌍 Countries"    value={details.production_countries?.map(c => c.name).join(", ")} />
//                 <Row label="🌍 Origin"       value={details.origin_country?.join(", ")} />
//                 <Row label="💰 Budget"       value={details.budget > 0 ? `$${details.budget?.toLocaleString()}` : null} />
//                 <Row label="💵 Revenue"      value={details.revenue > 0 ? `$${details.revenue?.toLocaleString()}` : null} />
//                 <Row label="🔞 Adult"        value={details.adult ? "Yes" : "No"} />
//                 <Row label="📦 In Production" value={details.in_production !== undefined ? (details.in_production ? "Yes" : "No") : null} />
//                 <Row label="🆔 TMDB ID"      value={details.id} />
//                 <Row label="🆔 IMDB ID"      value={details.external_ids?.imdb_id} />
//                 <Row label="📘 Facebook"     value={details.external_ids?.facebook_id} />
//                 <Row label="📸 Instagram"    value={details.external_ids?.instagram_id} />
//                 <Row label="🐦 Twitter"      value={details.external_ids?.twitter_id} />
//                 <Row label="📺 Freebase"     value={details.external_ids?.freebase_id} />
//                 <Row label="🌐 TVDB ID"      value={details.external_ids?.tvdb_id} />
//                 <Row label="🌐 Homepage"     value={details.homepage} />
//                 <Row label="🔤 Type"         value={details.type} />
//                 <Row label="🗂 Networks"     value={details.networks?.map(n => n.name).join(", ")} />
//               </div>
//             </div>

//             {/* ── 2. OVERVIEW ── */}
//             {details.overview && (
//               <SectionBlock title="📝 Overview">
//                 <p style={{ color: "#ccc", fontSize: "0.9rem", lineHeight: 1.7 }}>{details.overview}</p>
//               </SectionBlock>
//             )}

//             {/* ── 3. GENRES ── */}
//             {details.genres?.length > 0 && (
//               <SectionBlock title="🎭 Genres">
//                 <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
//                   {details.genres.map(g => <Badge key={g.id} text={g.name} />)}
//                 </div>
//               </SectionBlock>
//             )}

//             {/* ── 4. SPOKEN LANGUAGES ── */}
//             {details.spoken_languages?.length > 0 && (
//               <SectionBlock title="🗣 Spoken Languages">
//                 <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
//                   {details.spoken_languages.map((l, i) => <Tag key={i} text={`${l.english_name} (${l.iso_639_1})`} />)}
//                 </div>
//               </SectionBlock>
//             )}

//             {/* ── 5. CREATED BY ── */}
//             {details.created_by?.length > 0 && (
//               <SectionBlock title="✍️ Created By">
//                 <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap" }}>
//                   {details.created_by.map(p => <PersonChip key={p.id} person={p} sub="Creator" />)}
//                 </div>
//               </SectionBlock>
//             )}

//             {/* ── 6. DIRECTORS / KEY CREW ── */}
//             {details.credits?.crew?.length > 0 && (
//               <SectionBlock title="🎬 Key Crew">
//                 <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap" }}>
//                   {details.credits.crew
//                     .filter(c => ["Director", "Executive Producer", "Producer", "Screenplay", "Writer", "Story", "Original Music Composer"].includes(c.job))
//                     .slice(0, 10)
//                     .map((p, i) => <PersonChip key={i} person={p} sub={p.job} />)}
//                 </div>
//               </SectionBlock>
//             )}

//             {/* ── 7. CAST ── */}
//             {details.credits?.cast?.length > 0 && (
//               <SectionBlock title={`🎭 Cast (${details.credits.cast.length} total, showing 20)`}>
//                 <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap" }}>
//                   {details.credits.cast.slice(0, 20).map(p => (
//                     <PersonChip key={p.id} person={p} sub={`${p.character}${p.order !== undefined ? ` (#${p.order + 1})` : ""}`} />
//                   ))}
//                 </div>
//               </SectionBlock>
//             )}

//             {/* ── 8. PRODUCTION COMPANIES ── */}
//             {details.production_companies?.length > 0 && (
//               <SectionBlock title="🏭 Production Companies">
//                 <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap", alignItems: "center" }}>
//                   {details.production_companies.map(c => (
//                     <div key={c.id} style={{ background: "#2a2a2a", borderRadius: "8px", padding: "0.4rem 0.8rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
//                       {c.logo_path && <img src={`${IMG_SM}${c.logo_path}`} style={{ height: "24px", objectFit: "contain", filter: "brightness(0) invert(1)" }} />}
//                       <span style={{ color: "#ccc", fontSize: "0.8rem" }}>{c.name} {c.origin_country && `(${c.origin_country})`}</span>
//                     </div>
//                   ))}
//                 </div>
//               </SectionBlock>
//             )}

//             {/* ── 9. NETWORKS (TV) ── */}
//             {details.networks?.length > 0 && (
//               <SectionBlock title="📡 Networks">
//                 <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap", alignItems: "center" }}>
//                   {details.networks.map(n => (
//                     <div key={n.id} style={{ background: "#2a2a2a", borderRadius: "8px", padding: "0.4rem 0.8rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
//                       {n.logo_path && <img src={`${IMG_SM}${n.logo_path}`} style={{ height: "24px", objectFit: "contain", filter: "brightness(0) invert(1)" }} />}
//                       <span style={{ color: "#ccc", fontSize: "0.8rem" }}>{n.name} ({n.origin_country})</span>
//                     </div>
//                   ))}
//                 </div>
//               </SectionBlock>
//             )}

//             {/* ── 10. WATCH PROVIDERS ── */}
//             {details["watch/providers"]?.results && (
//               <SectionBlock title="📺 Watch Providers">
//                 {Object.entries(details["watch/providers"].results).slice(0, 5).map(([country, data]) => (
//                   <div key={country} style={{ marginBottom: "0.6rem" }}>
//                     <p style={{ color: "#888", fontSize: "0.78rem", marginBottom: "0.3rem" }}>🌍 {country}</p>
//                     <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
//                       {[...(data.flatrate || []), ...(data.rent || []), ...(data.buy || [])].map((p, i) => (
//                         <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.3rem", background: "#2a2a2a", borderRadius: "6px", padding: "0.3rem 0.5rem" }}>
//                           {p.logo_path && <img src={`${IMG_SM}${p.logo_path}`} style={{ width: "24px", height: "24px", borderRadius: "4px" }} />}
//                           <span style={{ color: "#ccc", fontSize: "0.75rem" }}>{p.provider_name}</span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 ))}
//               </SectionBlock>
//             )}

//             {/* ── 11. RELEASE DATES / CERTIFICATIONS ── */}
//             {details.release_dates?.results?.length > 0 && (
//               <SectionBlock title="📋 Release Dates & Certifications">
//                 <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
//                   {details.release_dates.results.slice(0, 10).map((r, i) => (
//                     <div key={i} style={{ background: "#2a2a2a", borderRadius: "6px", padding: "0.3rem 0.6rem", fontSize: "0.75rem" }}>
//                       <span style={{ color: "#f5c518" }}>{r.iso_3166_1}: </span>
//                       {r.release_dates.map((d, j) => (
//                         <span key={j} style={{ color: "#ccc" }}>
//                           {d.release_date?.slice(0, 10)} {d.certification && `[${d.certification}]`}{" "}
//                         </span>
//                       ))}
//                     </div>
//                   ))}
//                 </div>
//               </SectionBlock>
//             )}

//             {/* Content Ratings (TV) */}
//             {details.content_ratings?.results?.length > 0 && (
//               <SectionBlock title="🔞 Content Ratings">
//                 <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
//                   {details.content_ratings.results.map((r, i) => (
//                     <div key={i} style={{ background: "#2a2a2a", borderRadius: "6px", padding: "0.3rem 0.6rem", fontSize: "0.75rem" }}>
//                       <span style={{ color: "#f5c518" }}>{r.iso_3166_1}: </span>
//                       <span style={{ color: "#ccc" }}>{r.rating}</span>
//                     </div>
//                   ))}
//                 </div>
//               </SectionBlock>
//             )}

//             {/* ── 12. SEASONS (TV) ── */}
//             {details.seasons?.length > 0 && (
//               <SectionBlock title={`🗂 Seasons (${details.seasons.length})`}>
//                 <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap" }}>
//                   {details.seasons.map(s => (
//                     <div key={s.id} style={{ background: "#2a2a2a", borderRadius: "8px", padding: "0.5rem", width: "120px", textAlign: "center" }}>
//                       {s.poster_path
//                         ? <img src={`${IMG_SM}${s.poster_path}`} style={{ width: "100%", borderRadius: "4px", marginBottom: "0.3rem" }} />
//                         : <div style={{ height: "80px", background: "#333", borderRadius: "4px", marginBottom: "0.3rem", display: "flex", alignItems: "center", justifyContent: "center", color: "#555" }}>📺</div>
//                       }
//                       <p style={{ color: "#fff", fontSize: "0.75rem", margin: 0 }}>{s.name}</p>
//                       <p style={{ color: "#888", fontSize: "0.7rem", margin: 0 }}>{s.episode_count} eps</p>
//                       <p style={{ color: "#888", fontSize: "0.7rem", margin: 0 }}>{s.air_date?.slice(0, 4)}</p>
//                     </div>
//                   ))}
//                 </div>
//               </SectionBlock>
//             )}

//             {/* ── 13. LAST EPISODE (TV) ── */}
//             {details.last_episode_to_air && (
//               <SectionBlock title="📺 Last Episode">
//                 <Row label="Name"    value={details.last_episode_to_air.name} />
//                 <Row label="Season"  value={`S${details.last_episode_to_air.season_number}E${details.last_episode_to_air.episode_number}`} />
//                 <Row label="Air Date" value={details.last_episode_to_air.air_date} />
//                 <Row label="Rating"  value={details.last_episode_to_air.vote_average?.toFixed(1)} />
//                 <p style={{ color: "#aaa", fontSize: "0.8rem", marginTop: "0.3rem" }}>{details.last_episode_to_air.overview}</p>
//               </SectionBlock>
//             )}

//             {/* ── 14. NEXT EPISODE (TV) ── */}
//             {details.next_episode_to_air && (
//               <SectionBlock title="⏭ Next Episode">
//                 <Row label="Name"    value={details.next_episode_to_air.name} />
//                 <Row label="Season"  value={`S${details.next_episode_to_air.season_number}E${details.next_episode_to_air.episode_number}`} />
//                 <Row label="Air Date" value={details.next_episode_to_air.air_date} />
//               </SectionBlock>
//             )}

//             {/* ── 15. KEYWORDS ── */}
//             {(details.keywords?.keywords || details.keywords?.results)?.length > 0 && (
//               <SectionBlock title="🏷 Keywords">
//                 <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
//                   {(details.keywords.keywords || details.keywords.results).map(k => <Tag key={k.id} text={k.name} />)}
//                 </div>
//               </SectionBlock>
//             )}

//             {/* ── 16. ALTERNATIVE TITLES ── */}
//             {(details.alternative_titles?.titles || details.alternative_titles?.results)?.length > 0 && (
//               <SectionBlock title="🔤 Alternative Titles">
//                 <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
//                   {(details.alternative_titles.titles || details.alternative_titles.results).slice(0, 15).map((t, i) => (
//                     <Tag key={i} text={`${t.title || t.name} (${t.iso_3166_1})`} />
//                   ))}
//                 </div>
//               </SectionBlock>
//             )}

//             {/* ── 17. TRANSLATIONS ── */}
//             {details.translations?.translations?.length > 0 && (
//               <SectionBlock title="🌐 Available Translations">
//                 <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
//                   {details.translations.translations.map((t, i) => (
//                     <Tag key={i} text={`${t.english_name} (${t.iso_639_1})`} />
//                   ))}
//                 </div>
//               </SectionBlock>
//             )}

//             {/* ── 18. REVIEWS ── */}
//             {details.reviews?.results?.length > 0 && (
//               <SectionBlock title={`💬 Reviews (${details.reviews.total_results} total)`}>
//                 {details.reviews.results.slice(0, 3).map(r => (
//                   <div key={r.id} style={{ background: "#222", borderRadius: "8px", padding: "0.8rem", marginBottom: "0.6rem" }}>
//                     <p style={{ color: "#f5c518", fontSize: "0.82rem", marginBottom: "0.2rem" }}>
//                       {r.author} {r.author_details?.rating && `⭐ ${r.author_details.rating}/10`}
//                     </p>
//                     <p style={{ color: "#aaa", fontSize: "0.78rem", display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
//                       {r.content}
//                     </p>
//                     <p style={{ color: "#555", fontSize: "0.7rem", marginTop: "0.3rem" }}>{r.created_at?.slice(0, 10)}</p>
//                   </div>
//                 ))}
//               </SectionBlock>
//             )}

//             {/* ── 19. VIDEOS ── */}
//             {details.videos?.results?.length > 0 && (
//               <SectionBlock title={`🎥 Videos (${details.videos.results.length} total)`}>
//                 <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
//                   {details.videos.results.map(v => (
//                     <a key={v.id} href={`https://youtube.com/watch?v=${v.key}`} target="_blank" rel="noreferrer"
//                       style={{
//                         background: v.type === "Trailer" ? "#c00" : "#333",
//                         color: "#fff", padding: "0.4rem 0.8rem", borderRadius: "6px",
//                         fontSize: "0.78rem", textDecoration: "none",
//                       }}>
//                       ▶ {v.type}: {v.name}
//                     </a>
//                   ))}
//                 </div>
//               </SectionBlock>
//             )}

//             {/* ── 20. POSTER IMAGES ── */}
//             {details.images?.posters?.length > 0 && (
//               <SectionBlock title={`🖼 Posters (${details.images.posters.length})`}>
//                 <div style={{ display: "flex", gap: "0.5rem", overflowX: "auto", paddingBottom: "0.5rem" }}>
//                   {details.images.posters.slice(0, 10).map((img, i) => (
//                     <img key={i} src={`${IMG_SM}${img.file_path}`}
//                       style={{ height: "150px", borderRadius: "6px", flexShrink: 0 }} />
//                   ))}
//                 </div>
//               </SectionBlock>
//             )}

//             {/* ── 21. BACKDROP IMAGES ── */}
//             {details.images?.backdrops?.length > 0 && (
//               <SectionBlock title={`🏞 Backdrops (${details.images.backdrops.length})`}>
//                 <div style={{ display: "flex", gap: "0.5rem", overflowX: "auto", paddingBottom: "0.5rem" }}>
//                   {details.images.backdrops.slice(0, 10).map((img, i) => (
//                     <img key={i} src={`${IMG_LG}${img.file_path}`}
//                       style={{ height: "100px", borderRadius: "6px", flexShrink: 0 }} />
//                   ))}
//                 </div>
//               </SectionBlock>
//             )}

//             {/* ── 22. LOGO IMAGES ── */}
//             {details.images?.logos?.length > 0 && (
//               <SectionBlock title={`🔷 Logos (${details.images.logos.length})`}>
//                 <div style={{ display: "flex", gap: "0.5rem", overflowX: "auto", paddingBottom: "0.5rem", alignItems: "center" }}>
//                   {details.images.logos.slice(0, 8).map((img, i) => (
//                     <img key={i} src={`${IMG_LG}${img.file_path}`}
//                       style={{ height: "50px", objectFit: "contain", flexShrink: 0, filter: "brightness(0) invert(1)" }} />
//                   ))}
//                 </div>
//               </SectionBlock>
//             )}

//             {/* ── 23. RECOMMENDATIONS ── */}
//             {details.recommendations?.results?.length > 0 && (
//               <SectionBlock title="👍 Recommendations">
//                 <div style={{ display: "flex", gap: "0.6rem", overflowX: "auto", paddingBottom: "0.5rem" }}>
//                   {details.recommendations.results.slice(0, 10).map(r => (
//                     <div key={r.id} style={{ flexShrink: 0, width: "100px", textAlign: "center" }}>
//                       {r.poster_path
//                         ? <img src={`${IMG_SM}${r.poster_path}`} style={{ width: "100%", borderRadius: "6px" }} />
//                         : <div style={{ height: "150px", background: "#333", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", color: "#555" }}>🎬</div>
//                       }
//                       <p style={{ color: "#ccc", fontSize: "0.7rem", marginTop: "0.3rem" }}>{r.title || r.name}</p>
//                       <p style={{ color: "#f5c518", fontSize: "0.7rem" }}>⭐ {r.vote_average?.toFixed(1)}</p>
//                     </div>
//                   ))}
//                 </div>
//               </SectionBlock>
//             )}

//             {/* ── 24. SIMILAR ── */}
//             {details.similar?.results?.length > 0 && (
//               <SectionBlock title="🔁 Similar">
//                 <div style={{ display: "flex", gap: "0.6rem", overflowX: "auto", paddingBottom: "0.5rem" }}>
//                   {details.similar.results.slice(0, 10).map(r => (
//                     <div key={r.id} style={{ flexShrink: 0, width: "100px", textAlign: "center" }}>
//                       {r.poster_path
//                         ? <img src={`${IMG_SM}${r.poster_path}`} style={{ width: "100%", borderRadius: "6px" }} />
//                         : <div style={{ height: "150px", background: "#333", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", color: "#555" }}>🎬</div>
//                       }
//                       <p style={{ color: "#ccc", fontSize: "0.7rem", marginTop: "0.3rem" }}>{r.title || r.name}</p>
//                       <p style={{ color: "#f5c518", fontSize: "0.7rem" }}>⭐ {r.vote_average?.toFixed(1)}</p>
//                     </div>
//                   ))}
//                 </div>
//               </SectionBlock>
//             )}

//             {/* ── 25. RAW JSON ── */}
//             <SectionBlock title="📦 Raw JSON (all fields)">
//               <details>
//                 <summary style={{ cursor: "pointer", color: "#f5c518", fontSize: "0.82rem" }}>
//                   Click to expand — {Object.keys(details).length} top-level fields
//                 </summary>
//                 <pre style={{ fontSize: "0.65rem", color: "#666", marginTop: "0.5rem", whiteSpace: "pre-wrap", wordBreak: "break-all", maxHeight: "400px", overflowY: "auto" }}>
//                   {JSON.stringify(details, null, 2)}
//                 </pre>
//               </details>
//             </SectionBlock>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// // ── Card ─────────────────────────────────────────────────────────────────────
// const Card = ({ item, onClick }) => (
//   <div onClick={() => onClick(item.id)} style={{
//     background: "#1a1a1a", borderRadius: "8px", padding: "1rem",
//     display: "flex", gap: "1rem", cursor: "pointer",
//     border: "1px solid #2a2a2a", transition: "transform 0.15s",
//   }}
//     onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"}
//     onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
//   >
//     {item.poster_path
//       ? <img src={`${IMG_SM}${item.poster_path}`} style={{ width: "80px", height: "120px", objectFit: "cover", borderRadius: "4px", flexShrink: 0 }} />
//       : <div style={{ width: "80px", height: "120px", background: "#333", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#555" }}>🎬</div>
//     }
//     <div style={{ fontSize: "0.82rem", color: "#ccc", overflow: "hidden" }}>
//       <p style={{ color: "#fff", fontWeight: "bold", marginBottom: "0.4rem" }}>{item.title || item.name}</p>
//       <p>⭐ {item.vote_average?.toFixed(1)} ({item.vote_count?.toLocaleString()} votes)</p>
//       <p>📅 {item.release_date || item.first_air_date || "N/A"}</p>
//       <p>🆔 {item.id} &nbsp;|&nbsp; 🌐 {item.original_language?.toUpperCase()}</p>
//       <p style={{ color: "#aaa", fontSize: "0.75rem", marginTop: "0.3rem", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
//         {item.overview || "No overview"}
//       </p>
//       <p style={{ color: "#f5c518", fontSize: "0.75rem", marginTop: "0.4rem" }}>Click for full details →</p>
//     </div>
//   </div>
// );

// // ── List Section ─────────────────────────────────────────────────────────────
// const ListSection = ({ title, endpoint, type }) => {
//   const [data, setData] = useState(null);
//   const [page, setPage] = useState(1);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedId, setSelectedId] = useState(null);

//   useEffect(() => {
//     setLoading(true);
//     setError(null);
//     fetch(`${BASE_URL}${endpoint}?api_key=${KEY}&page=${page}`)
//       .then(res => res.json())
//       .then(json => setData(json))
//       .catch(err => setError(err.message))
//       .finally(() => setLoading(false));
//   }, [page, endpoint]);

//   const handlePageChange = (p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); };

//   return (
//     <div style={{ marginBottom: "3rem" }}>
//       {/* <h2 style={{ color: "#f5c518", borderBottom: "1px solid #333", paddingBottom: "0.5rem" }}>
//         {title}
//         {data && <span style={{ color: "#888", fontSize: "0.85rem", fontWeight: "normal", marginLeft: "1rem" }}>
//           Total: {data.total_results?.toLocaleString()} | Pages: {data.total_pages?.toLocaleString()}
//         </span>}
//       </h2> */}

//       {/* {data && <Pagination page={page} totalPages={data.total_pages} onPageChange={handlePageChange} />} */}

//       {loading ? <p style={{ color: "#888" }}>Loading page {page}...</p>
//         : error ? <p style={{ color: "red" }}>Error: {error}</p>
//         : <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
//             {data?.results?.map(item => <Card key={item.id} item={item} type={type} onClick={setSelectedId} />)}
//           </div>
//       }

//       {data && <Pagination page={page} totalPages={data.total_pages} onPageChange={handlePageChange} />}
//       {selectedId && <Modal id={selectedId} type={type} onClose={() => setSelectedId(null)} />}
//     </div>
//   );
// };

// // ── App ──────────────────────────────────────────────────────────────────────
// const MovieApi = () => (
//   <div style={{ background: "#111", minHeight: "100vh", padding: "2rem", fontFamily: "sans-serif", marginTop: "80px" }}>
//     {/* <h1 style={{ color: "#f5c518", marginBottom: "2rem" }}>🎬 TMDB API Test</h1> */}
//     <ListSection title="🎥 Popular Movies" endpoint="/movie/popular" type="movie" />
//     <ListSection title="📺 Popular Shows"  endpoint="/tv/popular"    type="tv"    />
//   </div>
// );

// export default MovieApi;



import { useEffect, useState } from "react";

const KEY = import.meta.env.VITE_TMDB_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMG = "https://image.tmdb.org/t/p/w500";

// ── Card ─────────────────────────────────────────────
const Card = ({ item, onClick }) => (
  <div
    onClick={() => onClick(item.id)}
    style={{
      minWidth: "140px",
      maxWidth: "180px",
      flex: "0 0 auto",
      cursor: "pointer",
      borderRadius: "12px",
      overflow: "hidden",
      background: "#181818",
      transition: "0.3s",
      boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
    }}
    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.06)")}
    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
  >
    <div style={{ position: "relative" }}>
      <img
        src={item.poster_path ? `${IMG}${item.poster_path}` : ""}
        style={{
          width: "100%",
          height: "220px",
          objectFit: "cover",
          background: "#222",
        }}
      />

      {/* rating badge */}
      <div
        style={{
          position: "absolute",
          top: "8px",
          left: "8px",
          background: "#f5c518",
          color: "#111",
          fontSize: "0.7rem",
          padding: "0.2rem 0.5rem",
          borderRadius: "6px",
          fontWeight: "bold",
        }}
      >
        ⭐ {item.vote_average?.toFixed(1) || "0"}
      </div>
    </div>

    <div style={{ padding: "0.6rem" }}>
      <p
        style={{
          margin: 0,
          color: "#fff",
          fontSize: "0.85rem",
          fontWeight: "600",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {item.title || item.name}
      </p>

      <p
        style={{
          margin: "0.3rem 0 0",
          color: "#aaa",
          fontSize: "0.75rem",
        }}
      >
        {item.release_date || item.first_air_date || "Unknown"}
      </p>
    </div>
  </div>
);

// ── Row Section (Netflix style) ─────────────────────
const RowSection = ({ title, endpoint, onSelect }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`${BASE_URL}${endpoint}?api_key=${KEY}`)
      .then((res) => res.json())
      .then(setData);
  }, [endpoint]);

  return (
    <div style={{ marginBottom: "2rem" }}>
      <h2
        style={{
          color: "#fff",
          fontSize: "1.1rem",
          marginBottom: "0.8rem",
        }}
      >
        {title}
      </h2>

      <div
        style={{
          display: "flex",
          gap: "0.8rem",
          overflowX: "auto",
          paddingBottom: "0.5rem",
          scrollbarWidth: "none",
        }}
      >
        {data?.results?.map((item) => (
          <Card key={item.id} item={item} onClick={onSelect} />
        ))}
      </div>
    </div>
  );
};

// ── Modal (simple clean version) ─────────────────────
const Modal = ({ id, type, onClose }) => {
  const [details, setDetails] = useState(null);

  useEffect(() => {
    fetch(
      `${BASE_URL}/${type}/${id}?api_key=${KEY}&append_to_response=credits`
    )
      .then((res) => res.json())
      .then(setDetails);
  }, [id, type]);

  if (!details) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.85)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "1rem",
        zIndex: 999,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#141414",
          borderRadius: "14px",
          width: "100%",
          maxWidth: "600px",
          padding: "1.2rem",
          color: "#fff",
        }}
      >
        <h2 style={{ marginBottom: "0.5rem" }}>
          {details.title || details.name}
        </h2>

        <p style={{ color: "#aaa", fontSize: "0.85rem" }}>
          {details.release_date || details.first_air_date}
        </p>

        <p style={{ marginTop: "1rem", color: "#ccc", lineHeight: 1.5 }}>
          {details.overview?.slice(0, 300)}...
        </p>

        <button
          onClick={onClose}
          style={{
            marginTop: "1rem",
            padding: "0.6rem 1rem",
            background: "#f5c518",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

// ── MAIN APP ─────────────────────────────────────────
const MovieApi = () => {
  const [selected, setSelected] = useState(null);
  const [type, setType] = useState("movie");

  return (
    <div
      style={{
        background: "#0b0b0b",
        minHeight: "100vh",
        padding: "1.5rem",
        fontFamily: "sans-serif",
        marginTop: "80px",
      }}
    >
      {/* Header */}
      {/* <h1
        style={{
          color: "#f5c518",
          textAlign: "center",
          marginBottom: "1.5rem",
          fontSize: "1.6rem",
        }}
      >
        🎬 Movie Explorer
      </h1> */}

      {/* Rows */}
      <RowSection
        title="🔥 Popular Movies"
        endpoint="/movie/popular"
        onSelect={(id) => {
          setSelected(id);
          setType("movie");
        }}
      />

      <RowSection
        title="📺 Popular TV Shows"
        endpoint="/tv/popular"
        onSelect={(id) => {
          setSelected(id);
          setType("tv");
        }}
      />

      {/* Modal */}
      {selected && (
        <Modal
          id={selected}
          type={type}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
};

export default MovieApi;