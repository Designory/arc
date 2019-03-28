import Vue from 'vue';
import Router from 'vue-router';
import LandingScreen from '../components/LandingScreen/LandingScreen.vue';

import PageBuilder from '../components/PageBuilder/PageBuilder.vue';
import SideBar from '../components/SideBar/SideBar.vue';

import TreePane from '../components/Panes/TreePane/TreePane.vue';
import ModulePane from '../components/Panes/ModulePane/ModulePane.vue';
import ModuleListPane from '../components/Panes/ModuleListPane/ModuleListPane.vue';

import PageBuilderControls from '../components/Controls/PageBuilderControls.vue';

import TemplateEditor from '../components/TemplateEditor/TemplateEditor.vue';
import TemplateEditorPane from '../components/Panes/TemplateEditorPane/TemplateEditorPane.vue';

import settings from '../settings.json';

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
			path: '/:lang/template-view/:listName',
			name: 'templateView',
			components: {
				main: TemplateEditor,
				navigation: SideBar,
			},
			children: [
				{
					path: '',
					components: {
						controls: null,
						sidebar: TemplateEditorPane
					}
				},
			]
		}
	]
});