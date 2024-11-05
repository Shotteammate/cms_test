// import { IconPaths } from "../constants/enums";

// export const getIcon = (iconName) => {
//   return IconPaths[iconName] || "";
// };

import { IconPaths } from "../constants/enums";

export const getIcon = (iconName) => {
  const lowerCaseIconName = iconName.toLowerCase().replace(" ", "_");
  return IconPaths[lowerCaseIconName] || "";
};
