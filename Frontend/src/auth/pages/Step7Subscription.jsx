// src/auth/pages/Step7Subscription.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Button } from "../../shared/ui/Button";

/**
 * Step7Subscription
 * Étape 7 du signup : sélection d’un plan d’abonnement
 *
 * Props :
 * - data : contient le center sélectionné et matières choisies
 * - setData : fonction pour mettre à jour l’abonnement choisi
 * - onNext : callback pour continuer l’inscription
 * - onBack : callback pour revenir à l’étape précédente
 */
export default function Step7Subscription({ data, setData, onNext, onBack }) {
  const { t } = useTranslation();

  // 🔹 Plans disponibles : Jour / Semaine / Mois / Trimestre / Année
  const subscriptionPlans = [
    { id: "daily", label: t("subscription.daily"), multiplier: 1 / 30, color: "bg-blue-100", border: "border-blue-400" },
    { id: "weekly", label: t("subscription.weekly"), multiplier: 1 / 4, color: "bg-indigo-100", border: "border-indigo-400" },
    { id: "monthly", label: t("subscription.monthly"), multiplier: 1, color: "bg-green-100", border: "border-green-400" },
    { id: "quarterly", label: t("subscription.quarterly"), multiplier: 3, color: "bg-yellow-100", border: "border-yellow-400" },
    { id: "yearly", label: t("subscription.yearly"), multiplier: 12, color: "bg-red-100", border: "border-red-400" },
  ];

  // Plan sélectionné par défaut
  const [selectedPlan, setSelectedPlan] = useState(data.subscription || null);

  /**
   * Calcul du prix total pour chaque plan
   */
  const getTotalPrice = (plan) => {
    if (!data.center || !data.subjects.length) return 0;

    let sum = 0;
    data.center.levels.forEach((cls) => {
      cls.subjects.forEach((subject) => {
        if (data.subjects.includes(subject.name)) {
          sum += cls.pricePerSubject?.[subject.name] || 0;
        }
      });
    });

    return Math.round(sum * plan.multiplier);
  };

  return (
    <motion.div
      key="step-7-subscription"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Titre */}
      <h1 className="text-3xl font-bold text-primary">
        {t("signup.chooseSubscription")}
      </h1>
      <p className="text-black/70">{t("signup.chooseSubscriptionInfo")}</p>

      {/* Plans sous forme de cartes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4 p-2">
        {subscriptionPlans.map((plan) => {
          const isSelected = selectedPlan?.id === plan.id;
          const price = getTotalPrice(plan);

          return (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan)}
              className={`
                cursor-pointer p-6 border rounded-lg transition-transform transform hover:scale-[1.02] 
                ${plan.color} ${plan.border} 
                ${isSelected ? "ring-2 ring-primary ring-offset-2" : ""}
              `}
            >
              {/* Nom du plan */}
              <div className="font-bold text-xl mb-2">{plan.label}</div>

              {/* Prix par matière */}
              <div className="space-y-1 mb-4">
                {data.center?.levels.map((cls) =>
                  cls.subjects
                    .filter((s) => data.subjects.includes(s.name))
                    .map((subject) => (
                      <div
                        key={`${cls.id}-${subject.id}`}
                        className="flex justify-between text-gray-800"
                      >
                        <span>{subject.name}</span>
                        <span className="font-semibold">
                          {(cls.pricePerSubject?.[subject.name] * plan.multiplier).toLocaleString()} $
                        </span>
                      </div>
                    ))
                )}
              </div>

              {/* Total */}
              <div className="border-t border-gray-900 pt-2 mt-2 flex justify-between font-semibold text-gray-900">
                <span>Total</span>
                <span>{price.toLocaleString()} $</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <Button variant="outline" className="rounded" onClick={onBack}>
          ← {t("signup.back")}
        </Button>

        <Button
          className="rounded"
          onClick={() => {
            if (!selectedPlan) return;
            setData({ ...data, subscription: selectedPlan });
            onNext();
          }}
          disabled={!selectedPlan}
        >
          {t("signup.continue")}
        </Button>
      </div>
    </motion.div>
  );
}
