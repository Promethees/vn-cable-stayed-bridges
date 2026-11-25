import { useState } from 'react';
import type { BridgeImage } from '../types';

function ImageLink({ img, reason }: { img: BridgeImage; reason: string }) {
  return (
    <li className="gallery-link">
      <a href={img.source || img.url} target="_blank" rel="noopener noreferrer">
        Xem ảnh tại nguồn
      </a>{' '}
      <span className="muted">
        ({reason}{img.credit ? ` · ${img.credit}` : ''})
      </span>
    </li>
  );
}

function GalleryItem({ img, alt }: { img: BridgeImage; alt: string }) {
  const [failed, setFailed] = useState(false);
  if (img.license.trim().toLowerCase() === 'unknown') return <ImageLink img={img} reason="giấy phép chưa rõ" />;
  if (failed) return <ImageLink img={img} reason="không tải được ảnh" />;
  return (
    <li>
      <figure>
        <img src={img.url} alt={alt} loading="lazy" onError={() => setFailed(true)} />
        <figcaption>
          © {img.credit || 'không rõ'} · {img.license}
          {img.source && (
            <>
              {' · '}
              <a href={img.source} target="_blank" rel="noopener noreferrer">
                Nguồn
              </a>
            </>
          )}
        </figcaption>
      </figure>
    </li>
  );
}

export function ImageGallery({ images, name }: { images: BridgeImage[]; name: string }) {
  if (!images.length) return null;
  return (
    <section className="card-section">
      <h3>Hình ảnh</h3>
      <ul className="gallery">
        {images.map((img, i) => (
          <GalleryItem key={img.url + i} img={img} alt={`${name} – ảnh ${i + 1}`} />
        ))}
      </ul>
    </section>
  );
}
