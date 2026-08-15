import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToHash() {
	const { pathname, hash } = useLocation();

	useEffect(() => {
		if (!hash) {
			window.scrollTo({
				top: 0,
				left: 0,
				behavior: "smooth",
			});
			return;
		}

		// Small delay so the destination page renders first
		setTimeout(() => {
			const element = document.querySelector(hash);

			if (element) {
				element.scrollIntoView({
					behavior: "smooth",
					block: "start",
				});
			}
		}, 100);
	}, [pathname, hash]);

	return null;
}