<template>
	<div class="landing-screen">
		<ul class="landing-screen__list">
			<router-link class="landing-screen__list-item" tag="li" to="/page-builder">
				Page Builder
			</router-link>
		</ul>
		<div v-for="item in collections" :key="item.title">
			<h6 class="landing-screen__list-title">
				{{item.title}}
			</h6>
			<ul class="landing-screen__list">
				<router-link v-for="list in item.lists" :key="list" class="landing-screen__list-item" tag="li" 
										:to="{ path: `/template-view/${list}`}">
					{{list}}
				</router-link>
			</ul>
		</div>
	</div>
</template>

<script src="./LandingScreen.js"></script>
<style src="./LandingScreen.scss"></style>