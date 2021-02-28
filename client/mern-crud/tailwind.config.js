module.exports = {
	purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {
			colors: {
				"primary-dark": "#18191A",
				primary: "#242526",
				"primary-light": "#3A3B3C",
				secundary: "#CACDD3",
				"secundary-light": "#EFF1F8",
				realced: "#2D88FF",
				error: "#F02849",
				info: "#E57E1F",
				success: "#31A24C",
			},
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
};
