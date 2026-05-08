"use client";

import Lightbox from "yet-another-react-lightbox";

import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";

import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

type Props = {
  open: boolean;
  close: () => void;
  index: number;
  slides: { src: string }[];
};

export default function GalleryLightbox({
  open,
  close,
  index,
  slides,
}: Props) {
  return (
    <Lightbox
      open={open}
      close={close}
      index={index}
      slides={slides}
      plugins={[Zoom, Thumbnails]}
      carousel={{
        finite: false,
      }}
      animation={{
        fade: 300,
      }}
      zoom={{
        maxZoomPixelRatio: 3,
        zoomInMultiplier: 2,
      }}
      thumbnails={{
        position: "bottom",
        width: 100,
        height: 70,
        border: 0,
        borderRadius: 10,
      }}
      controller={{
        closeOnBackdropClick: true,
      }}
    />
  );
}