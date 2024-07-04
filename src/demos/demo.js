import * as tf from '@tensorflow/tfjs'

const a = tf.tensor([[1, 2], [3, 4]]);
const y = tf.tidy(() => {
 const result = a.square().log().neg();
 return result;
});

console.log(tf.getBackend())