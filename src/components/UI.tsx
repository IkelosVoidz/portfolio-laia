import { atom, useAtom } from "jotai";
import { useEffect } from "react";

const pictures = [
  "DSC00680",
  "DSC00933",
  "DSC00966",
  "DSC00983",
  "DSC01011",
  "DSC01040",
];

export const pageAtom = atom(0);
export const pages = [
  {
    front: "book-cover",
    back: pictures[0],
  },
];
for (let i = 1; i < pictures.length - 1; i += 2) {
  pages.push({
    front: pictures[i % pictures.length],
    back: pictures[(i + 1) % pictures.length],
  });
}

pages.push({
  front: pictures[pictures.length - 1],
  back: "book-back",
});

export const UI = () => {
  const [page, _] = useAtom(pageAtom);

  useEffect(() => {
    const audio = new Audio("/audios/page-flip-01a.mp3");
    audio.play();
  }, [page]);


  return (
    <>
      {/* <div className=" overflow-auto pointer-events-auto d-flex justify-content-center">
        <div className="overflow-auto d-flex align-items-center gap-4 flex-nowrap px-4 py-3">
          {[...pages].map((_, index) => (
            <button
              key={index}
              className={`btn rounded-pill text-uppercase px-3 py-2 ${index === page
                ? "bg-white text-dark"
                : "bg-dark text-white"
                }`}
              style={{
                transition: "all 0.3s ease",
                borderColor: "transparent",
                borderWidth: "1px",
              }}
              onClick={() => setPage(index)}
            >
              {index === 0 ? "Cover" : `Page ${index}`}
            </button>
          ))}
          <button
            className={`btn rounded-pill text-uppercase px-3 py-2 ${page === pages.length ? "bg-white text-dark" : "bg-dark text-white"
              }`}
            style={{
              transition: "all 0.3s ease",
              borderColor: "transparent",
              borderWidth: "1px",
            }}
            onClick={() => setPage(pages.length)}
          >
            Back Cover
          </button>
        </div>
      </div> */}
    </>
  );

};