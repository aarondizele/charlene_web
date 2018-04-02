<template>
    <div class="footer">
        <div class="container text-muted">
            <div class="row font-weight-light">
                <div class="col-12 py-2 d-flex flex-row align-items-center justify-content-between">
                    <div class="d-flex flex-row align-items-center">
                      <span class="d-flex flex-row align-items-center">&copy; {{new Date().getFullYear()}}. Conçu avec <i class="fa fa-heart text-danger px-1" aria-label="true"></i></span> par
                      <a href="https://connect-92807.firebaseapp.com/" target="_blank" class="h6 pl-1 brand"><strong>94connect.</strong></a>
                    </div>
                    <div class="d-flex flex-row align-items-center">
                      <span class="pointer"><i class="fa fa-twitter mr-3" aria-label="true"></i></span>
                      <span class="pointer"><i class="fa fa-facebook-official" aria-label="true"></i></span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
h6, .h6 {
    margin: 0;
    padding: 0
}
.brand {
    letter-spacing: -2px !important
}
.footer {
    position: absolute !important;
    bottom: 0 !important;
    width: 100% !important;
    font-size: 13px !important;
}
i {
    font-size: 18px !important;
}
.container {
    border-top: 1px solid rgba(0, 0, 0, .08) !important;
    /* color: rgb(188, 197, 213) !important; */
}
</style>