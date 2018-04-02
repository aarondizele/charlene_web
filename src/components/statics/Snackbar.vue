<template>
  <div id="snackbar" class="font-weight-light">
      Vous n'êtes pas connecté. Veuillez-vous connecter!
    </div> 
</template>

<script>
export default {
  created () {
  }
}
</script>


<style scoped>
/* Toast */
#snackbar{
	visibility: hidden;
	position: fixed;
	min-width: 250px;
	color: white;
	background-color: #333;
	text-align: center;
	z-index: 1;
	padding: 12px 18px;
	bottom: 3%;
	left: 50%;
	transform: translateX(-50%);
	font-size: 15px;
	border-radius: 4px;
}
#snackbar.show{
	visibility: visible;
	animation: fadein .5s, fadeout .5s 2.5s;
}

@keyframes fadein {
    from {bottom: 0; opacity: 0;}
    to {bottom: 5%; opacity: 1;}
}

@keyframes fadeout {
    from {bottom: 5%; opacity: 1;}
    to {bottom: 0; opacity: 0;}
}
</style>

