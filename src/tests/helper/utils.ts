interface Generated {
  output?: Array<any>;
}

export const getOutputFromGenerated: object = (
  generated: Generated
): object => {
  return generated.output ? generated.output[0] : generated;
};
