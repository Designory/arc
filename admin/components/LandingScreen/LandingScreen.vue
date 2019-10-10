<template>
	<div class="landing-screen">
		<div class="landing-screen__row-wrapper" v-for="row in links" :key="row.title">
			<div class="landing-screen__row-label">{{row.title}}</div>
			<ul class="landing-screen__list">
				<li class="landing-screen__list-item-wrapper" :key="item.listName || item.href" v-for="item in row.items">
					
					<router-link 
						v-if="item.listName"  
						class="landing-screen__list-item"
						tag="span" 
						:to="{ path: (item.type !== 'builder') ? `/${$store.getters.getLangPath}/list/${item.listName}` : `/${$store.getters.getLangPath}/page-builder`}"
						:style="{'border-color':alphaOnHex($store.state.globals.app.theme.primaryColor, '.2')}">
						<span class="landing-screen__list-icon" v-html="item.svg || ''"></span>
						{{item.label}}
					</router-link>
					
					<a v-else class="landing-screen__list-item href" :href="item.href" :target="item.target || '_blank'">
						<span class="landing-screen__list-icon" v-html="item.svg || ''"></span>
						{{item.label}}
					</a>
				</li>
			</ul>
		</div>
	</div>
</template>

<script src="./LandingScreen.js"></script>
<style src="./LandingScreen.scss"></style>