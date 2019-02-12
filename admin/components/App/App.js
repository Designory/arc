import Header from '../Header/Header.vue';
// import NavigationPane from '../Navigation/NavigationPane.vue';
import Footer from '../Footer/Footer.vue';

export default {
	components: {
		Header,
		// NavigationPane,
		Footer
	},
	created() {
		console.log('This One: ', this.$store.state);
	},
	beforeMount() {
		document.documentElement.style.setProperty('--primary-color', this.$store.state.globals.app.theme.primaryColor);
	}
};
