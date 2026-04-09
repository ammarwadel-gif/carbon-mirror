import * as tf from '@tensorflow/tfjs';

export class AIPredictor {
  private model: tf.LayersModel | null = null;
  
  // تدريب نموذج بسيط
  async train() {
    // بيانات تدريب: [carbonScore, days] → futureImpact
    const trainingData = tf.tensor2d([
      [10, 30], [20, 60], [30, 90], [40, 120], [50, 150],
      [60, 180], [70, 210], [80, 240], [90, 270], [100, 300]
    ]);
    
    const labels = tf.tensor2d([
      [150], [300], [450], [600], [750],
      [900], [1050], [1200], [1350], [1500]
    ]);
    
    // بناء نموذج بسيط
    this.model = tf.sequential({
      layers: [
        tf.layers.dense({ units: 10, inputShape: [2], activation: 'relu' }),
        tf.layers.dense({ units: 5, activation: 'relu' }),
        tf.layers.dense({ units: 1 })
      ]
    });
    
    this.model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });
    await this.model.fit(trainingData, labels, { epochs: 100 });
  }
  
  // توقع التأثير المستقبلي
  async predict(carbonScore: number, days: number = 365) {
    if (!this.model) await this.train();
    
    const input = tf.tensor2d([[carbonScore, days]]);
    const prediction = this.model!.predict(input) as tf.Tensor;
    const result = await prediction.data();
    
    return {
      yearlyImpact: Math.round(result[0]),
      treesNeeded: Math.round(result[0] / 21),
      recommendation: this.getRecommendation(carbonScore)
    };
  }
  
  private getRecommendation(score: number): string {
    if (score < 20) return "🌿 ممتاز! استمر في استخدام الدراجة والأكل النباتي";
    if (score < 40) return "🌱 جيد! قلل استخدام السيارة بمقدار يوم واحد في الأسبوع";
    if (score < 60) return "⚠️ حاول استبدال وجبة لحم بوجبة نباتية يوميًا";
    if (score < 80) return "🔥 خطر! استخدم وسائل النقل العامة بدل السيارة";
    return "💀 تحذير شديد! غيّر عاداتك فورًا";
  }
}

export const aiPredictor = new AIPredictor();