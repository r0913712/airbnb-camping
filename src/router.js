import Vue from 'vue';
import Router from 'vue-router';
import LandingPage from '@/components/LandingPage.vue';
import GetStartedPage from '@/components/GetStartedPage.vue';
import LogInPage from '@/components/LogInPage.vue';
import HomePage from '@/components/HomePage.vue';
import CampingSpotsPage from '@/components/CampingSpotsPage.vue';
import CreateCampingSpotPage from '@/components/CreateCampingSpotPage.vue';
import CampingSpotDetail from '@/components/CampingSpotDetail.vue';
import BookingsPage from '@/components/BookingsPage.vue';
import OwnerBookingsPage from '@/components/OwnerBookingsPage.vue';
import OwnerCampingSpots from '@/components/OwnerCampingSpots.vue';
import UpdateCampingSpot from '@/components/UpdateCampingSpot.vue';
import EditUserPage from '@/components/EditUserPage.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    { path: '/', component: LandingPage,meta: { showHomeButton: false } },
    { path: '/get-started', component: GetStartedPage , meta: { showHomeButton: false }},
    { path: '/login', component: LogInPage, meta: { showHomeButton: false } },
    { path: '/home', component: HomePage, meta: { showHomeButton: false } },
    { path: '/camping-spots', component: CampingSpotsPage },
    { path: '/create-camping-spot', component: CreateCampingSpotPage },
    {
      path: '/camping-spot/:id',
      name: 'CampingSpotDetail',
      component: CampingSpotDetail,
      props: route => ({
        id: route.params.id,
        startDate: route.query.startDate,
        endDate: route.query.endDate,
        amenities: route.params.amenities ? JSON.parse(route.params.amenities) : []
      })
    },
    {path: '/bookings', component: BookingsPage},
    {path: '/owner-bookings', component: OwnerBookingsPage},
    {
      path: '/owner-camping-spots',
      name: 'OwnerCampingSpots',
      component: OwnerCampingSpots
    },
    {
      path: '/update-camping-spot/:id',
      name: 'UpdateCampingSpot',
      component: UpdateCampingSpot
    },
    {
      path: '/edit-user/:user',
      name: 'EditUser',
      component: EditUserPage
    }
    
  ]
});
