import { useEffect, useRef } from "react";
import documentIcon from "/document-icon.png";

export default function CursorFollower() {
	const iconRef = useRef(null);
	const mouse = useRef({ x: 0, y: 0 });
	const pos = useRef({ x: 0, y: 0 });
	const rafId = useRef(null);
	const hasMoved = useRef(false);

	useEffect(() => {
		function handleMouseMove(e) {
			mouse.current.x = e.clientX;
			mouse.current.y = e.clientY;
			if (!hasMoved.current) {
				// snap to first position instantly so it doesn't fly in from 0,0
				pos.current.x = e.clientX;
				pos.current.y = e.clientY;
				hasMoved.current = true;
			}
		}

		window.addEventListener("mousemove", handleMouseMove);

		const EASE = 0.15; // lower = laggier/floatier, higher = snappier

		function animate() {
			pos.current.x += (mouse.current.x - pos.current.x) * EASE;
			pos.current.y += (mouse.current.y - pos.current.y) * EASE;

			if (iconRef.current) {
				iconRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(20px, 20px)`;
			}

			rafId.current = requestAnimationFrame(animate);
		}
		rafId.current = requestAnimationFrame(animate);

		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
			cancelAnimationFrame(rafId.current);
		};
	}, []);

	return (
		<img
			ref={iconRef}
			src={documentIcon}
			alt=""
			aria-hidden="true"
			className="
				pointer-events-none
				fixed
				top-0
				left-0
				z-[9999]
				w-10
				h-10
				opacity-0
				hidden
				md:block
				md:opacity-90
				drop-shadow-[0_8px_16px_rgba(0,0,0,0.15)]
			"
			style={{ willChange: "transform" }}
		/>
	);
}