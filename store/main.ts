import {defineStore} from 'pinia';

export const CustomerTypes = {
 tarim: {
  name: 'Tarım',
  image:
   'https://www.antalyaenerji.com/wp-content/uploads/2019/04/gunes-enerjili-tarimsal-sulama-sistemleri.jpg',
 },
 sanayi: {
  name: 'Sanayi',
  image:
   'https://i.dunya.com/storage/files/images/2022/01/20/gunes-enerjisi-3B7g_cover.jpg',
 },
 ev: {
  name: 'Ev',
  image:
   'https://images.squarespace-cdn.com/content/v1/594844f08419c2ec53a36f51/1643230524966-VW5XMMXKU53E11GDG49J/solar+panel+systems+for+homes+in+Florida.jpg',
 },
};

export const useMainStore = defineStore('main', () => {
 const customerType = ref('tarim');
 function setCustomerType(ct: keyof typeof CustomerTypes) {
  customerType.value = ct;
 }
 function getCustomerType() {
  return CustomerTypes[customerType.value];
 }
 return {setCustomerType, getCustomerType, customerType};
});
