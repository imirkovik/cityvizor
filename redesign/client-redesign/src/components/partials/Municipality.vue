<template>
  <li class="c-municipalities__entry"
    @click="openMunicipality">
    <img v-if="municipality.urlZnak"
      :src="municipality.urlZnak"
      :alt="municipality.nazev"
      class="c-municipalities__entry__heraldry">
    <span v-else
      class="c-municipalities__entry__placeholder"></span>
    <span v-html="highlightSearch(municipality.hezkyNazev || municipality.nazev)"
      class="c-municipalities__entry__label"></span>
    <span class="c-municipalities__entry__region">
      {{ region }}
    </span>
    <small v-if="!municipality.urlCityVizor"
      class="c-municipalities__entry__cta">
      {{ cms.configuration.ctaMunicipality }}
    </small>
    <div>
    <button
      type="button"
      class="btn"
      @click="showModal"
    >
      Open Modal!
    </button>

    <modal
      v-show="isModalVisible"
      @close="closeModal"
    />
  </div>
  </li>
</template>

<script>
import AddMunicipalityModal from './AddMunicipalityModal'

export default {
  components: {
    AddMunicipalityModal
  },
  props: {
    isModalVisible: false,
    cms: {
      type: Object,
      default() {
          return {}
      }
    },
    municipality: {
      type: Object
    }
  },
  computed: {
    region() {
      return this.municipality.adresaUradu.kraj;
    }
  },
  methods: {
    highlightSearch(string) {
      const expression = new RegExp(`(${this.searchPhrase})`, 'gi');
      return string.replace(expression, '<strong>$1</strong>');
    },
    openMunicipality() {
      if (this.municipality.urlCityVizor) {
        window.location.href = this.municipality.urlCityVizor;
      } else {
        //show modal
      }
    },
    showModal() {
        this.isModalVisible = true;
      },
    closeModal() {
        this.isModalVisible = false;
    }
  }
}
</script>
