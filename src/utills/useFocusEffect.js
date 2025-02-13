import { useEffect, useRef } from 'react';
import { useIsFocused } from '@react-navigation/native';

export function useFocusEffect(effect) {
 const isFocused = useIsFocused();
 const effectRef = useRef();

 useEffect(() => {
    effectRef.current = effect;
 });

 useEffect(
    () => {
      const handleFocus = () => {
        effectRef.current && effectRef.current();
      };

      if (isFocused) {
        handleFocus();
      }

      return () => {
        effectRef.current = undefined;
      };
    },
    [isFocused]
 );
}