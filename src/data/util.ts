export function enumKeys<O extends object, K extends keyof O = keyof O>(
  obj: O
): K[] {
  return Object.keys(obj).filter((k) => Number.isNaN(+k)) as K[];
}

export function getSetProperty<O extends object, V extends O[keyof O]>(
  a: V,
  b: V,
  values: O
): V {
  if (a === b) {
    return a;
  }

  const keys = enumKeys(values);
  for (const key of keys) {
    if (values[key] !== a && values[key] !== b) {
      return values[key] as V;
    }
  }

  throw new Error("This never happens");
}

export function getRandomValue<O extends object>(obj: O) {
  const keys = enumKeys(obj);
  return obj[keys[Math.floor(Math.random() * keys.length)]];
}
