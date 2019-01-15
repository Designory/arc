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
    'icon', 
    'iconColor'
  ],
  data: function () {
    return {
        unactiveIconColor: false,
        activeIconColor: '#fff',
        isActive: false
    }
  },
  computed:{
    iconBg(){
      if (!this.icon) return '';
      const returnStr = (this.isActive) ? icons[this.icon](this.activeIconColor) : icons[this.icon](this.unactiveIconColor);
      return `url('data:image/svg+xml;utf8,${returnStr}')`;
    }
  },
  methods:{
    click(event, id){
        
      console.log(this.$router);

      if (this.to) return this.$router.push(this.to);

      if (this.isActive) {
          this.confirmClick(id);
          // this is a bit of a trick, the confirm click action 
          // above will remove the item via or other method
          // to give the user immediate satisfaction, we hide it
          // on click
          event.target.closest('li').style.display = 'none';
      } else {

          this.isActive = true;

          setTimeout(() => {
            this.isActive = false;
          }, 5000);
        }
    }
  },
  beforeMount(){
    this.unactiveIconColor = this.iconColor;
  }
};