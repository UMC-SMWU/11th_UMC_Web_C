export function Footer() {
  return (
    <footer className="border-t border-[#E5E7EB] bg-white">
      <div className="mx-auto flex h-[60px] max-w-[1440px] items-center justify-end gap-3 px-20">
        <img
          src="/images/logos/tmdb-logo.svg"
          alt="TMDB 로고"
          className="h-3 w-auto"
        />
        <p className="text-[12px] text-[#606774]">
          This product uses the TMDB API but is not endorsed or certified by{" "}
          <a
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            TMDB
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
