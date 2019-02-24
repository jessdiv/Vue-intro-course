const eventBus = new Vue()

Vue.component('product', {
  props: {
    premium: {
      type: Boolean,
      required: true,
    }
  },
  template: `<div class="product">

    <div class="product-image">
      <img :src='image' alt="Woolly socks">
    </div>

    <div class="product-info">
      <h1>{{ title }}</h1>
      <p v-if='inStock'>In Stock</p>
      <p v-else>Out of Stock</p>
      <p>Shipping: {{ shipping }}</p>

      <ul>
        <li v-for='detail in details'>{{ detail }}</li>
      </ul>

      <div v-for='(variant, index) in variants'
            :key='variant.variantId'
            class='color-box'
            :style='{ backgroundColor: variant.variantColor  }'
            @mouseover='updateProduct(index)'>
      </div>

      <ul>
        <li v-for='size in sizes'>{{ size }}</li>
      </ul>

      <button v-on:click='addToCart'
            :disabled='!inStock'
            :class='{ disabledButton: !inStock }'> Add to Cart </button>
      <button v-on:click='removeFromCart'> Remove from Cart </button>

    </div>

    <product-tabs :reviews='reviews'></product-tabs>

  </div>`
  ,
  data() {
    return {
      brand: 'Vue Mastery',
      product: 'Socks',
      selectedVariant: 0,
      details: ["80% cotton", "20% polyester", "Gender-neutral"],
      variants: [
        {
          variantId: 2234,
          variantColor: 'grey',
          variantImage: 'wool-socks.jpeg',
          variantQuantity: 10,
        },
        {
          variantId: 2235,
          variantColor: 'blue',
          variantImage: 'blue-socks.jpg',
          variantQuantity: 0,
        }
      ],
      sizes: ['6', '7', '8', '9', '10'],
      cart: 0,
      reviews: []
    }
  },
  methods: {
    addToCart() {
      this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
    },
    updateProduct(index) {
      this.selectedVariant = index;
    },
    removeFromCart() {
      this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId )
    },
  },
  computed: {
    title() {
      return this.brand + ' ' + this.product
    },
    image() {
      return this.variants[this.selectedVariant].variantImage
    },
    inStock() {
      return this.variants[this.selectedVariant].variantQuantity;
    },
    shipping() {
      if (this.premium) {
        return 'free';
      }
        return '$5.99'
    }
  },
  mounted() {
    eventBus.$on('review-submitted', productReview => {
      this.reviews.push(productReview)
    })
  }
})

Vue.component('product-review', {
  template: `
    <form class='review-form' @submit.prevent='onSubmit'>
      <p v-if='errors.length'>
        <b> Please correct the following error(s): </b>
        <ul>
          <li v-for='error in errors'> {{ error }} </li>
        </ul
      </p>

      <p>
        <label for='name'>Name: </label>
        <input id='name' v-model='name'>
      </p>

      <p>
        <label for='review'>Review: </label>
        <textarea id='review' v-model='review'></textarea>
      </p>

      <p>
        <label for='rating'>Rating: </label>
        <select id='rating' v-model.number='rating'>
          <option>1</option>
          <option>2</option>
          <option>3</option>
          <option>4</option>
          <option>5</option>
        </select>
      </p>

      <p>
        <label for='recommend'>Would you recommend this product?> </label>
        <input type="radio" v-model='recommend' value="yes"> Yes<br>
        <input type="radio" v-model='recommend' value="no"> No<br>
        <input type="radio" v-model='recommend' value="maybe"> Maybe<br>
      </p>

      <p>
        <input type='submit' value='Submit'>
      </p>
    </form>
  `,
  data() {
    return {
      name: null,
      review: null,
      rating: null,
      recommend: null,
      errors: [],
    }
  },
  methods: {
    onSubmit() {
      this.errors = [];
      if (this.name && this.review && this.rating) {
        let productReview = {
          name: this.name,
          review: this.review,
          rating: this.rating,
          recommend: this.recommend,
        }
        eventBus.$emit('review-submitted', productReview)
        this.name = null
        this.review = null
        this.rating = null
        this.recomment = null
      } else {
        if (!this.name) this.errors.push('Name required.')
        if (!this.review) this.errors.push('Review required.')
        if (!this.rating) this.errors.push('Rating required.')
        if (!this.recommend) this.errors.push('Answer required.')
      }
    }
  }
})

Vue.component('product-tabs', {
  props: {
    reviews: {
      type: Array,
      required: false
    }
  },
  template: `
          <div>

            <ul>
              <span class="tab"
                    v-for="(tab, index) in tabs"
                    @click="selectedTab = index"
              >{{ tab }}</span>
            </ul>

            <div v-show="selectedTab === 'Review'">
                <p v-if="!reviews.length">There are no reviews yet.</p>
                <ul v-else>
                    <li v-for="review in reviews">
                      <p>{{ review.name }}</p>
                      <p>Rating:{{ review.rating }}</p>
                      <p>{{ review.review }}</p>
                    </li>
                </ul>
            </div>

            <div v-show="selectedTab === 'Make a Review'">

              <product-review></product-review>
            </div>

          </div>
    `,
    data() {
      return {
        tabs: ['Reviews', 'Make a Review'],
        selectedTab: 'Reviews'
      }
    }
})

const app = new Vue({
  el: '#app',
  data: {
    premium: true,
    cart: [],
  },
  methods: {
    updateCart(id) {
      this.cart.push(id)
    },
    removeFromCart() {
      this.cart.pop()
    }
  }
})
