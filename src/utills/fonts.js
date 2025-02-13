export const Fonts = {
 poppinsLight: "Poppins-Light",
 poppinsRegular:"Poppins-Regular",
 poppinsMedium: "Poppins-Medium",
 poppinsBold: "Poppins-Bold",
 poppinsSemiBold: "Poppins-SemiBold",
 RobotoLight: "Roboto-Light",
 RobotoRegular: "Roboto-Regular",
 RobotoMedium: "Roboto-Medium",
 RobotoBold: "Roboto-Bold"
};

export const FONT_FAMILY = {
    ROBOTO_400: 'Roboto-Regular',
    ROBOTO_500: 'Roboto-Medium',
    ROBOTO_600: 'Roboto-Bold',
    POPPINS_400: 'Poppins-Regular',
    POPPINS_500: 'Poppins-Medium',
    POPPINS_600: 'Poppins-SemiBold',
    POPPINS_700: 'Poppins-Bold',
}

export function textFamily(textFontFamily) {
    switch (textFontFamily) {
      case 'poppins400':
        return FONT_FAMILY.POPPINS_400
      case 'poppins500':
        return FONT_FAMILY.POPPINS_500
      case 'poppins600':
        return FONT_FAMILY.POPPINS_600
      case 'poppins700':
        return FONT_FAMILY.POPPINS_700
      case 'roboto400':
        return FONT_FAMILY.ROBOTO_400
      case 'roboto500':
        return FONT_FAMILY.ROBOTO_500
      case 'roboto600':
        return FONT_FAMILY.ROBOTO_600
      default:
        return FONT_FAMILY.POPPINS_400
    }
  };

  export const FONT_SIZE = {
    BUTTON: 14,
    TEXT: 14,
    TEXT_INPUT: 15,
    SENTENCE_TEXT: 13,
}