
export default {
  methods: {
    showBuildModal(){
      let modal = document.querySelector('[data-build-modal]'); 

      modal.style.display = 'flex';
    },
    closeBuildModal(event){
      let modal = document.querySelector('[data-build-modal]'); 
      let closeButton = document.querySelector('[data-close-button]');

      if(event.target === modal || event.target === closeButton){
        modal.style.display = 'none';
      }
    }
  }
};
