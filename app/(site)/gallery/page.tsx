import { getGallery } from "@/lib/data";

export const metadata = { title: "გალერეა" };
export const revalidate = 300;

export default async function GalleryPage() {
  const items = await getGallery();
  return (
    <section className="container section">
      <h1 className="h1" style={{ marginBottom: 24 }}>გალერეა</h1>
      {items.length ? (
        <div className="gallery">
          {items.map((g) => (
            <figure key={g.id}>
              <img src={g.image_url} alt={g.caption ?? ""} loading="lazy" />
              {g.caption && <figcaption>{g.caption}</figcaption>}
            </figure>
          ))}
        </div>
      ) : (
        <p className="muted">ფოტოები მალე დაემატება.</p>
      )}
    </section>
  );
}
