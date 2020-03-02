<template>
  <div class="container-fluid border text-left">
    <h4>Machines Team A</h4>
    <div class="machines-container row">
      <div class="base-station col-md-12 mb-1">
        <div>
          <div class="base-image-container ">
            <figure>
                <img :src="imageUrl" alt="">
                <figcaption >C_Z21 </figcaption>
            </figure>
          </div>
        </div>
      </div>

      <div class="delivery-station col-md-12 mb-1">
        <div class="row ml-0">
          <div class="delivery-image-container mr-1">
              <figure>
                <img :src="imageUrl" alt="">
                <figcaption class="text-center">C_Z22 </figcaption>
              </figure>
          </div>
          <div class="machine-state">
            <div>
              <span>State</span>
            </div>
            <span>#boxes</span>
          </div>
        </div>
      </div>

      <div class="storage-station col-md-12 mb-1">
        <div>
          <div class="storage-image-container">
            <figure>
              <img :src="imageUrl" alt="">
              <figcaption >C_Z23 </figcaption>
            </figure>
          </div>
        </div>
      </div>

      <div class="ring-station-1 col-md-12 mb-1">
        <div>
          <div class="ring1-image-container ">
            <figure>
              <img :src="imageUrl" alt="">
              <figcaption >C_Z24 </figcaption>
            </figure>
          </div>
        </div>
      </div>

      <div class="ring-station-2 col-md-12 mb-1">
        <div>
          <div class="ring2-image-container">
            <figure>
              <img :src="imageUrl" alt="">
              <figcaption >C_Z25 </figcaption>
            </figure>
          </div>
        </div>
      </div>

      <div class="cap-station-1 col-md-12 mb-1">
        <div>
          <div class="cap1-image-container">
            <figure>
              <img :src="imageUrl" alt="">
              <figcaption> C_Z26 </figcaption>
            </figure>
          </div>
        </div>
      </div>

      <div class="cap-station-2 col-md-12 mb-1"> 
        <div>
          <div class="cap2-image-container">
            <figure>
              <img :src="imageUrl" alt="">
              <figcaption>C_Z27 </figcaption>
            </figure>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'BodyMachinesTeamA',
  data() {
    return {
      imageUrl: 'http://via.placeholder.com/50x25'
    }
  }
}
</script>

<style>
figcaption {
  font-size: 12px;
}

</style>