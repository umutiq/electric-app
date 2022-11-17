<!-- @ts-nocheck -->
<template>
  <div class="grid grid-cols-1 lg:grid-cols-4">
    <div class="col-span-1 h-full lg:col-span-3">
      <img :src="customerType.image" class="w-full h-full object-cover" />
    </div>
    <div class="col-span-1 h-full overflow-y-scroll pb-32">
      <div class="flex flex-col p-8 gap-8">
        <div v-if="!isCalculated" class="flex flex-col gap-6">
          <h3 class="font-bold text-4xl text-center leading-10">Solar Panel</h3>
          <div class="relative">
            <InputsTextInput
              v-model="address"
              input-for="address"
              :input-label="'Home Address'"
              :rows="3"
            />
            <button
              class="absolute bottom-7 right-4 group"
              @click="getLocation"
            >
              <LocationMarkerIcon
                class="h-6 w-6 group-hover:text-red-500 transition"
              />
            </button>
          </div>
          <template v-if="!isHomeNew">
            <div class="relative">
              <InputsTextInput
                v-model="monthlyBill"
                input-for="monthlyBill"
                :input-label="'Monthly Bill'"
                :rows="1"
              />
              <div class="absolute bottom-[.5rem] right-4 text-base">
                ₺ / ay
              </div>
            </div>
          </template>
          <template v-else>
            <div class="relative">
              <InputsTextInput
                v-model="area"
                input-for="area"
                :input-label="'Area of Home (m²)'"
                :rows="1"
              />
              <div class="absolute bottom-[.5rem] right-4 text-base">m²</div>
            </div>
            <div class="relative">
              <label for="stories" class="uppercase text-xs font-bold ml-2"
                >Stories</label
              >
              <Listbox v-model="selectedStory">
                <div class="relative mt-1">
                  <ListboxButton
                    class="relative w-full cursor-pointer rounded-lg bg-slate-200 py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-sky-300 sm:text-sm"
                  >
                    <div class="flex gap-4 items-center">
                      <span class="block truncate">{{ selectedStory }}</span>
                    </div>

                    <span
                      class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
                    >
                      <SelectorIcon
                        class="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                  </ListboxButton>

                  <transition
                    leave-active-class="transition duration-100 ease-in"
                    leave-from-class="opacity-100"
                    leave-to-class="opacity-0"
                  >
                    <ListboxOptions
                      class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                    >
                      <ListboxOption
                        v-for="story in stories"
                        v-slot="{ active, selected }"
                        :key="story"
                        :value="story"
                        as="template"
                      >
                        <li
                          :class="[
                            active
                              ? 'bg-sky-100 text-sky-900'
                              : 'text-gray-900',
                            'relative cursor-default select-none py-2 pl-10 pr-4',
                          ]"
                        >
                          <span
                            :class="[
                              selected ? 'font-medium' : 'font-normal',
                              'block truncate',
                            ]"
                            >{{ story }}</span
                          >
                          <span
                            v-if="selected"
                            class="absolute inset-y-0 left-0 flex items-center pl-3 text-sky-600"
                          >
                            <CheckIcon class="h-5 w-5" aria-hidden="true" />
                          </span>
                        </li>
                      </ListboxOption>
                    </ListboxOptions>
                  </transition>
                </div>
              </Listbox>
            </div>
          </template>
          <div class="px-8 pt-6">
            <button
              class="py-1 transition text-white tracking-wide text-lg uppercase rounded-3xl w-full"
              :class="{
                'bg-sky-300 cursor-not-allowed': !canCalculate,
                'bg-sky-500 hover:bg-sky-600 active:bg-sky-700': canCalculate,
              }"
              :disabled="!canCalculate"
              @click="estimatePrice"
            >
              Calculate
            </button>
            <div class="pt-6 text-center">
              <button class="underline" @click="() => (isHomeNew = !isHomeNew)">
                <span v-if="isHomeNew"> I have bill information. </span>
                <span v-else> I don't have bill information.</span>
              </button>
            </div>
          </div>
        </div>
        <div v-else class="flex flex-col p-8 gap-4">
          <h3 class="font-bold text-4xl text-center leading-10">
            Select Product
          </h3>
          <h5 class="font-light text-sm text-center text-slate-600">
            Montajı yapılacak güneş panelleri güvenlik sorunları ve elektrik
            kesintileri göz önünde bulundurularak tasarlanmıştır.
          </h5>
          <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col items-center justify-center gap-2">
              <span class="text-2xl text-center">76 %</span>
              <span class="text-slate-600 text-center"
                >Tahmini Enerji Kazanımı</span
              >
            </div>
            <div class="flex flex-col items-center justify-center gap-2">
              <span class="text-2xl text-center">
                <span v-if="isBatteriesIncluded"
                  >~ {{ Math.ceil(33 / estimateObject.kw) }}</span
                >
                <span v-else> 0</span> Gün</span
              >
              <span class="text-slate-600 text-center"
                >Tahmini Enerji Depolama</span
              >
            </div>
          </div>
          <div class="border border-slate-600 rounded-lg p-3 mt-6">
            <div class="grid grid-cols-3">
              <div class="col-span-2 flex flex-col gap-2">
                <span class="text-xs text-slate-600">Bizim Önerdiğimiz</span>
                <span
                  class="cursor-pointer"
                  @click="() => (showSolarPanel = true)"
                >
                  <span class="font-bold"
                    >{{ estimateObject.kw.toFixed(2) }} kW</span
                  >
                  Güneş Paneli</span
                >
                <span
                  v-if="isBatteriesIncluded"
                  class="cursor-pointer"
                  @click="() => (showBatteryPanel = true)"
                  ><span class="font-bold">33kW</span> x
                  {{ estimateObject.batteryQty }} Batarya
                </span>
                <button
                  class="font-semibold text-sky-500 text-left"
                  @click="() => (isBatteriesIncluded = !isBatteriesIncluded)"
                >
                  <template v-if="!isBatteriesIncluded"> Batarya Ekle</template>
                  <template v-else> Bataryayı Kaldır</template>
                </button>
                <span class="underline text-slate-500 text-sm">{{
                  estimateObject.totalPrice.toLocaleString("tr-TR", {
                    style: "currency",
                    currency: "TRY",
                  })
                }}</span>
              </div>
              <div>
                <img
                  :src="
                    isBatteriesIncluded ? imSolarRoofWithBattery : imSolarRoof
                  "
                  alt=""
                />
              </div>
            </div>
            <div class="text-xs text-slate-400 text-center mt-4">
              Fiyat ve kW değerleri
              {{ (estimateObject.kw / 24).toFixed(2) }} kWh saatlik kullanım
              üzerinden hesaplanmıştır. Son fiyat çatınızın karmaşıklık seviyesi
              ve güneş paneli monte edilebilir alanına göre hesaplanacaktır.
            </div>
          </div>
          <div class="flex flex-col mt-4">
            <h3 class="font-bold text-4xl text-center leading-10">
              Sipariş Özeti
            </h3>
            <div class="grid grid-cols-2 p-2 bg-slate-300 mt-4 rounded-3xl">
              <div
                class="text-center py-1 px-2 rounded-3xl cursor-pointer transition"
                :class="{
                  'bg-white': !isLoanSelected,
                  'bg-transparent': isLoanSelected,
                }"
                @click="() => (isLoanSelected = false)"
              >
                Nakit
              </div>
              <div
                class="text-center py-1 px-2 rounded-3xl cursor-pointer transition"
                :class="{
                  'bg-white': isLoanSelected,
                  'bg-transparent': !isLoanSelected,
                }"
                @click="() => (isLoanSelected = true)"
              >
                Kredi
              </div>
            </div>
            <div class="flex flex-col mt-6">
              <div class="grid grid-cols-2 mt-1">
                <div class="text-sm">
                  {{ estimateObject.kw.toFixed(2) }} kW Güneş Paneli
                </div>
                <div class="text-right">
                  {{
                    estimateObject.roofPrice.toLocaleString("tr-TR", {
                      style: "currency",
                      currency: "TRY",
                    })
                  }}
                </div>
              </div>
              <div class="grid grid-cols-2 mt-1">
                <div class="text-sm">
                  {{ estimateObject.batteryQty }} Batarya
                </div>
                <div class="text-right">
                  {{
                    estimateObject.batteryPrice.toLocaleString("tr-TR", {
                      style: "currency",
                      currency: "TRY",
                    })
                  }}
                </div>
              </div>
              <div class="grid grid-cols-2 mt-1">
                <div class="text-sm font-bold">Ara Toplam</div>
                <div class="text-right">
                  {{
                    estimateObject.totalPrice.toLocaleString("tr-TR", {
                      style: "currency",
                      currency: "TRY",
                    })
                  }}
                </div>
              </div>
              <div class="h-[1px] w-full bg-slate-300 my-4"></div>
              <div class="grid grid-cols-2 mt-1">
                <div class="text-sm">KDV Oranı</div>
                <div class="text-right">18%</div>
              </div>
              <div class="grid grid-cols-2 mt-1">
                <div class="text-sm">KDV Tutarı</div>
                <div class="text-right">
                  {{
                    (estimateObject.totalPrice * 0.18).toLocaleString("tr-TR", {
                      style: "currency",
                      currency: "TRY",
                    })
                  }}
                </div>
              </div>
              <div class="grid grid-cols-2 mt-1">
                <div class="text-sm font-bold">Toplam</div>
                <div class="text-right">
                  {{
                    (
                      estimateObject.totalPrice +
                      estimateObject.totalPrice * 0.18
                    ).toLocaleString("tr-TR", {
                      style: "currency",
                      currency: "TRY",
                    })
                  }}
                </div>
              </div>
              <div class="h-[1px] w-full bg-slate-300 my-4"></div>
              <div v-if="isLoanSelected" class="grid grid-cols-2 mt-1">
                <div class="text-sm">Faiz Oranı</div>
                <div class="text-right">2.14%</div>
              </div>
              <div v-if="isLoanSelected" class="grid grid-cols-2 mt-1">
                <div class="text-sm">Vade</div>
                <div class="text-right">120 ay</div>
              </div>
              <div v-if="isLoanSelected" class="grid grid-cols-2 mt-1">
                <div class="text-sm font-bold">Ortalama Aylık Ödeme</div>
                <div class="text-right">
                  {{
                    calculateLoan(
                      estimateObject.totalPrice +
                        estimateObject.totalPrice * 0.18,
                      2.14,
                      120
                    ).toLocaleString("tr-TR", {
                      style: "currency",
                      currency: "TRY",
                    })
                  }}
                  / ay
                </div>
              </div>
              <div v-if="isLoanSelected" class="grid grid-cols-2 mt-1">
                <div class="text-sm font-bold">Toplam Geri Ödeme</div>
                <div class="text-right">
                  {{
                    (
                      calculateLoan(
                        estimateObject.totalPrice +
                          estimateObject.totalPrice * 0.18,
                        2.14,
                        120
                      ) * 120
                    ).toLocaleString("tr-TR", {
                      style: "currency",
                      currency: "TRY",
                    })
                  }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-show="showSolarPanel"
      class="absolute h-screen w-screen bg-black bg-opacity-50"
    >
      <div class="flex items-center justify-center h-full">
        <div
          ref="showSolarPanelModal"
          class="bg-white rounded-lg shadow-lg py-12 px-8 max-w-[50vw] flex flex-col gap-12"
        >
          <div class="text-4xl font-bold text-center">Güneş Paneli</div>
          <div class="grid grid-cols-2 gap-4">
            <div class="flex items-center justify-center">
              <img
                src="https://productimages.hepsiburada.net/s/71/550/110000012755356.jpg"
                alt=""
                class="w-96 h-96"
              />
            </div>
            <div class="flex flex-col gap-2">
              <h5 class="font-bold text-xl">Ürün Açıklaması</h5>
              <p class="italic">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Officia blanditiis esse quis mollitia illo libero optio
                temporibus incidunt natus nesciunt quaerat, commodi aut sequi
                modi, doloribus molestias dolore. Doloremque, ea!
              </p>
              <h5 class="font-bold text-xl pt-4">Ürün Özellikleri</h5>
              <ul class="list-disc">
                <li>Lorem ipsum dolor sit amet.</li>
                <li>Lorem ipsum dolor sit amet.</li>
                <li>Lorem ipsum dolor sit amet.</li>
                <li>Lorem ipsum dolor sit amet.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-show="showBatteryPanel"
      class="absolute h-screen w-screen bg-black bg-opacity-50"
    >
      <div class="flex items-center justify-center h-full">
        <div
          ref="showBatteryPanelModal"
          class="bg-white rounded-lg shadow-lg py-12 px-8 max-w-[50vw] flex flex-col gap-12"
        >
          <div class="text-4xl font-bold text-center">Batarya</div>
          <div class="grid grid-cols-2 gap-4">
            <div class="flex items-center justify-center">
              <img
                src="https://productimages.hepsiburada.net/s/3/550/9616827482162.jpg"
                alt=""
                class="w-96 h-96"
              />
            </div>
            <div class="flex flex-col gap-2">
              <h5 class="font-bold text-xl">Ürün Açıklaması</h5>
              <p class="italic">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Officia blanditiis esse quis mollitia illo libero optio
                temporibus incidunt natus nesciunt quaerat, commodi aut sequi
                modi, doloribus molestias dolore. Doloremque, ea!
              </p>
              <h5 class="font-bold text-xl pt-4">Ürün Özellikleri</h5>
              <ul class="list-disc">
                <li>Lorem ipsum dolor sit amet.</li>
                <li>Lorem ipsum dolor sit amet.</li>
                <li>Lorem ipsum dolor sit amet.</li>
                <li>Lorem ipsum dolor sit amet.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  LocationMarkerIcon,
  CheckIcon,
  SelectorIcon,
} from "@heroicons/vue/solid/index.js";
import { computed, Ref, watch } from "vue";
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/vue";
import { onClickOutside } from "@vueuse/core";
import { useMainStore } from "~~/store/main";
const store = useMainStore();
const customerType = computed(() => {
  return store.getCustomerType();
});
interface Address {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  display_name: string;
  address: { [key: string]: string };
  boundingbox: string[];
}
const address = ref("");
const lat = ref(0);
const lon = ref(0);
const monthlyBill = ref(0);
const area = ref(0);
const isHomeNew = ref(false);
const stories = ["1 Kat", "2 Kat", "3 Kat"];
const selectedStory = ref(stories[0]);
const METER_USAGE = 0.75;
const KWH_PRICE = 2.14;
const isBatteriesIncluded = ref(true);
const isCalculated = ref(false);
const isLoanSelected = ref(false);
const showSolarPanel = ref(false);
const showBatteryPanel = ref(false);

const showSolarPanelModal = ref(null);
const showBatteryPanelModal = ref(null);
const getLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      lat.value = position.coords.latitude;
      lon.value = position.coords.longitude;
      const fetchedAddress: Address = await $fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}&addressdetails=1`
      );
      address.value = `${fetchedAddress.display_name}`;
    });
  }
};
const canCalculateIsHomeNew = computed(() => {
  if (isHomeNew.value) {
    return selectedStory.value && area.value;
  }
  return monthlyBill.value;
});
const canCalculate = computed(() => {
  return canCalculateIsHomeNew.value && address.value;
});

const imSolarRoof =
  "https://tesla-cdn.thron.com/delivery/public/image/tesla/solar_roof_product_card/os2kvy/std/0x0/solar_roof_product_card";
const imSolarRoofWithBattery =
  "https://tesla-cdn.thron.com/delivery/public/image/tesla/solar_roof_powerwall_product_card/os2kvy/std/0x0/solar_roof_powerwall_product_card";

const calculateKW = () => {
  let kw = 0;
  if (isHomeNew.value) {
    kw = Math.round(
      (selectedStory.value === "1 Kat"
        ? 1
        : selectedStory.value === "2 Kat"
        ? 2
        : 3) *
        area.value *
        METER_USAGE
    );
  } else {
    kw = Math.round(monthlyBill.value / KWH_PRICE);
  }
  const kwh = kw / 30;
  return kwh;
};

const estimatedRoofPrice = () => {
  const kw = calculateKW();
  const SOLAR_PRICE_PER_KW = 15000;
  return kw * SOLAR_PRICE_PER_KW;
};

const estimatedBatteryQty = () => {
  if (!isBatteriesIncluded.value) return 0;
  const kw = calculateKW();
  const BATTERY_QTY_PER_KW = 0.03;
  return Math.ceil(kw * BATTERY_QTY_PER_KW);
};

const estimateObject: Ref<{
  kw?: number;
  yearUsage?: number;
  roofPrice?: number;
  batteryQty?: number;
  batteryQtyPrice?: number;
  batteryPrice?: number;
  totalPrice?: number;
}> = ref({
  kw: 0,
  yearUsage: 0,
  roofPrice: 0,
  batteryQty: 0,
  batteryQtyPrice: 0,
  batteryPrice: 0,
  totalPrice: 0,
});

watch(isBatteriesIncluded, () => {
  estimatePrice();
});

const estimatePrice = () => {
  const roofPrice = estimatedRoofPrice();
  const batteryQty = estimatedBatteryQty();
  const batteryQtyPrice = 12000;
  const batteryPrice = batteryQty * batteryQtyPrice;
  let totalPrice = 0;
  if (isBatteriesIncluded.value) {
    totalPrice = roofPrice + batteryPrice;
  } else {
    totalPrice = roofPrice;
  }
  estimateObject.value = {
    kw: calculateKW(),
    yearUsage: calculateKW() * 365,
    roofPrice,
    batteryQty,
    batteryQtyPrice,
    batteryPrice,
    totalPrice,
  };
  isCalculated.value = true;
};

const calculateLoan = (kredi: number, vergiFaiz: number, vade: number) => {
  vergiFaiz = vergiFaiz / 100;
  const deger1 = vergiFaiz * Math.pow(1 + vergiFaiz, vade);
  const deger2 = Math.pow(1 + vergiFaiz, vade) - 1;
  return kredi * (deger1 / deger2);
};
onClickOutside(showSolarPanelModal, () => {
  showSolarPanel.value = false;
});
onClickOutside(showBatteryPanelModal, () => {
  showBatteryPanel.value = false;
});
</script>
