<template>
  <div class="btn-wrapper"> 
    <button 
    	@click="click($event, id)" 
    	:class="`btn ${classAddition || ''} ${(icon) ? 'icon ' + icon: ''} ${(icon) ? 'icon': ''} ${(isActive) ? 'active': ''}`"
    	:style="(icon) ? {backgroundImage:iconBg} : ''">
		{{isActive ? confirmText || text || '' : text || ''}}	{{currentCount ? `(${currentCount})` : ''}}
	</button>
    <div v-if="tooltipMsg" :class="`button-tooltip ${tooltipColor || ''} ${icon} ${(isActive) ? 'active': ''}`">{{tooltipMsg}}</div>
  </div>
</template>

<!-- :to="to" -->

<script src="./Button.js"></script>
<style src="./Button.scss"></style>
<style src="./Tooltip.scss"></style>