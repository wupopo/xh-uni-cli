import user from '@/store/user'


const storeMap = {
  user,
}


export default function useStore(storeName:keyof typeof storeMap) {
  return storeMap[storeName]();
}
