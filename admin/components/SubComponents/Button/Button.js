import axios from 'axios';
import icons from './icons';

export default {
  props: [
    'confirmClick', 
    'id', 
    'classAddition', 
    'to', 
    'tooltipMsg', 
    'tooltipColor', 
    'text',
    'confirmText', 
    'icon', 
    'iconColor'
  ],
  data: function () {
    return {
        unactiveIconColor: false,
        activeIconColor: '#fff',
        isActive: false,
        totalCount:5,
        currentCount:false
    }
  },
  countTimer: null,
  computed:{
    iconBg(){
      if (!this.icon) return '';
      const returnStr = (this.isActive) ? icons[this.icon](this.activeIconColor) : icons[this.icon](this.unactiveIconColor);
      return `url('data:image/svg+xml;utf8,${returnStr}')`;
    }
  },
  methods:{
    click(event, id){

      if (this.to) return this.$router.push(this.to);

      if (this.isActive) {
          
          // avoid double clicks
          event.target.style.pointerEvents = "none";

          this.confirmClick(id);
          // this is a bit of a trick, the confirm click action 
          // above will remove the item via or other method
          // to give the user immediate satisfaction, we hide it
          // on click
          //event.target.closest('li').style.display = 'none';
          //
          
      } else {

          this.isActive = true;
          this.currentCount = this.totalCount;

          this.$options.countTimer = setInterval(() => {
            
            this.currentCount = this.currentCount - 1;
            
            if (this.currentCount <= 0) {
              clearInterval(this.$options.countTimer);    
              this.isActive = false;
              this.currentCount = false;
            }
            
          }, 1000);

        }
    }
  },
  beforeMount(){
    this.unactiveIconColor = this.iconColor;
  },
  beforeDestroy(){
    if (this.$options.countTimer) clearInterval(this.$options.countTimer);
    this.currentCount = false;
    this.isActive = false;
  }
};