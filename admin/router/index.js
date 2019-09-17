import Vue from 'vue';
import Router from 'vue-router';
import LandingScreen from '../components/LandingScreen/LandingScreen.vue';

import PageBuilder from '../components/PageBuilder/PageBuilder.vue';
import SideBar from '../components/SideBar/SideBar.vue';

import TreePane from '../components/Panes/TreePane/TreePane.vue';
import ModulePane from '../components/Panes/ModulePane/ModulePane.vue';
import ModuleListPane from '../components/Panes/ModuleListPane/ModuleListPane.vue';

import PageBuilderControls from '../components/Controls/PageBuilderControls.vue';

//import TemplateEditor from '../components/TemplateEditor/TemplateEditor.vue';
//import TemplateEditorPane from '../components/Panes/TemplateEditorPane/TemplateEditorPane.vue';

import ListMain from '../components/ListMain/ListMain.vue';
import ListSideBar from '../components/ListSideBar/ListSideBar.vue';

Vue.use(Router);

export default new Router({
	routes: [
		{
			path: '/',
			name:'dashboard',
			components: {
				main: LandingScreen,
				navigation: null
			}
		},
		{
			path: '/:lang/',
			name:'dashboard',
			components: {
				main: LandingScreen,
				navigation: null
			}
		},
		{
			path: '/:lang/page-builder',
			redirect: '/:lang/page-builder/tree',
			components: {
				main: PageBuilder,
				navigation: SideBar,
			},
			children: [
				{
					path: 'tree',
					components: {
						controls: PageBuilderControls,
						sidebar: TreePane
					}
				},
				{
					path: 'modules',
					components: {
						controls: PageBuilderControls,
						sidebar: ModulePane
					}
				},
				{
					path: 'modules/:listName',
					name: 'moduleList',
					components: {
						controls: PageBuilderControls,
						sidebar: ModuleListPane
					}
				}
			]
		},
		{
			path: '/:lang/list/:listName',
			name: 'templateView',
			components: {
				main: ListMain,
				navigation: ListSideBar
			},
			children: [
				{
					path: ':id',
					components: {
						main: ListMain,
						navigation: ListSideBar
					}
				}
			]
		}//,
		// {
		// 	path: '/:lang/labels/:listName',
		// 	name: 'templateView',
		// 	components: {
		// 		main: TemplateList,
		// 		navigation: TemplateSideBar,
		// 	},
		// 	children: [
		// 		{
		// 			path: '',
		// 			components: {
		// 				controls: null,
		// 				sidebar: TemplateEditorPane
		// 			}
		// 		},
		// 	]
		// },
		// {
		// 	path: '/:lang/template-view/:listName',
		// 	name: 'templateView',
		// 	components: {
		// 		main: TemplateEditor,
		// 		navigation: SideBar,
		// 	},
		// 	children: [
		// 		{
		// 			path: '',
		// 			components: {
		// 				controls: null,
		// 				sidebar: TemplateEditorPane
		// 			}
		// 		},
		// 	]
		// }
	]
});