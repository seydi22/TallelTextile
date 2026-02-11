"use client";
import { SectionTitle } from "@/components";
import CountrySelect from "@/components/CountrySelect";
import { useProductStore } from "../../_zustand/store";
import Image from "next/image";
import { useEffect, useState } from "react";

import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import apiClient from '@tallel-textile/shared/lib/api';
import { formatPriceMRU } from '@tallel-textile/shared/lib/formatPrice';
import { getImageUrl } from "@/utils/imageUtils";

const CheckoutPage = () => {
  
  const [checkoutForm, setCheckoutForm] = useState({
    name: "",
    lastname: "",
    phone: "",
    email: "",
    country: "",
    desiredDeliveryDate: "",
    orderNotice: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { products, total, clearCart } = useProductStore();
  const router = useRouter();

  // Add validation functions that match server requirements
  const validateForm = () => {
    const errors: string[] = [];
    
    // Validation du prénom
    if (!checkoutForm.name.trim() || checkoutForm.name.trim().length < 2) {
      errors.push("Le prénom doit contenir au moins 2 caractères");
    }
    
    // Validation du nom
    if (!checkoutForm.lastname.trim() || checkoutForm.lastname.trim().length < 2) {
      errors.push("Le nom doit contenir au moins 2 caractères");
    }
    
    // Validation de l'email (optionnel mais doit être valide si fourni)
    if (checkoutForm.email.trim()) {
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      if (!emailRegex.test(checkoutForm.email.trim())) {
        errors.push("Veuillez entrer une adresse email valide");
      }
    }
    
    // Validation du téléphone (doit contenir au moins 10 chiffres)
    const phoneDigits = checkoutForm.phone.replace(/[^0-9]/g, '');
    if (!checkoutForm.phone.trim() || phoneDigits.length < 10) {
      errors.push("Le numéro de téléphone doit contenir au moins 10 chiffres");
    }
    
    return errors;
  };

  const makePurchase = async () => {
    // Client-side validation first
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      validationErrors.forEach(error => {
        toast.error(error);
      });
      return;
    }

    // Basic client-side checks for required fields (UX only)
    const requiredFields = ['name', 'lastname', 'phone'];
    
    const missingFields = requiredFields.filter(field => 
      !checkoutForm[field as keyof typeof checkoutForm]?.trim()
    );

    if (missingFields.length > 0) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    if (products.length === 0) {
      toast.error("Votre panier est vide");
      return;
    }

    if (total <= 0) {
      toast.error("Le total de la commande est invalide");
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("🚀 Starting order creation...");
      
      // Get user ID if logged in
      let userId = null;
      
      // Prepare the order data
      const orderData = {
        name: checkoutForm.name.trim(),
        lastname: checkoutForm.lastname.trim(),
        phone: checkoutForm.phone.trim(),
        email: checkoutForm.email.trim() ? checkoutForm.email.trim().toLowerCase() : undefined,
        country: checkoutForm.country.trim() || undefined,
        desiredDeliveryDate: checkoutForm.desiredDeliveryDate.trim() || undefined,
        status: "pending",
        total: total,
        orderNotice: checkoutForm.orderNotice.trim(),
        userId: userId // Add user ID for notifications
      };

      console.log("📋 Order data being sent:", orderData);

      // Send order data to server for validation and processing
      const response = await apiClient.post("/api/orders", orderData);

      console.log("📡 API Response received:");
      console.log("  Status:", response.status);
      console.log("  Status Text:", response.statusText);
      console.log("  Response OK:", response.ok);
      
      // Check if response is ok before parsing
      if (!response.ok) {
        console.error("❌ Response not OK:", response.status, response.statusText);
        const errorText = await response.text();
        console.error("Error response body:", errorText);
        
        // Try to parse as JSON to get detailed error info
        try {
          const errorData = JSON.parse(errorText);
          console.error("Parsed error data:", errorData);
          
          // Gérer les différents types d'erreurs
          if (response.status === 409) {
            // Erreur de commande dupliquée
            toast.error(errorData.details || errorData.error || "Commande en double détectée");
            return; // Ne pas lancer d'exception, juste retourner pour arrêter l'exécution
          } else if (errorData.details && Array.isArray(errorData.details)) {
            // Erreurs de validation
            errorData.details.forEach((detail: any) => {
              toast.error(`${detail.field}: ${detail.message}`);
            });
          } else if (typeof errorData.details === 'string') {
            // Message d'erreur unique dans details
            toast.error(errorData.details);
          } else {
            // Message d'erreur de secours
            toast.error(errorData.error || "Échec de la création de la commande");
          }
        } catch (parseError) {
          console.error("Impossible de parser l'erreur en JSON:", parseError);
          toast.error("Échec de la création de la commande. Veuillez réessayer.");
        }
        
        return; // Stop execution instead of throwing
      }

      const data = await response.json();
      console.log("✅ Parsed response data:", data);
      
      const orderId: string = data.id;
      console.log("🆔 Extracted order ID:", orderId);

      if (!orderId) {
        console.error("❌ L'ID de commande est manquant ou invalide !");
        console.error("Données complètes de la réponse:", JSON.stringify(data, null, 2));
        throw new Error("ID de commande non reçu du serveur");
      }

      console.log("✅ Order ID validation passed, proceeding with product addition...");

      // Add products to order
      for (let i = 0; i < products.length; i++) {
        console.log(`🛍️ Adding product ${i + 1}/${products.length}:`, {
          orderId,
          productId: products[i].id,
          quantity: products[i].amount
        });
        
        await addOrderProduct(orderId, products[i].id, products[i].amount);
        console.log(`✅ Product ${i + 1} added successfully`);
      }

      console.log(" All products added successfully!");

      // Clear form and cart
      setCheckoutForm({
        name: "",
        lastname: "",
        phone: "",
        email: "",
        country: "",
        desiredDeliveryDate: "",
        orderNotice: "",
      });
      clearCart();
      
      // Refresh notification count if user is logged in
      try {
        // This will trigger a refresh of notifications in the background
        window.dispatchEvent(new CustomEvent('orderCompleted'));
      } catch (error) {
        console.log('Note: Could not trigger notification refresh');
      }
      
      toast.success("Commande créée avec succès ! Vous serez contacté pour le paiement.");
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (error: any) {
      console.error("💥 Error in makePurchase:", error);
      
      // Gérer les erreurs de validation du serveur
      if (error.response?.status === 400) {
        console.log(" Gestion de l'erreur 400...");
        try {
          const errorData = await error.response.json();
          console.log("Données d'erreur:", errorData);
          if (errorData.details && Array.isArray(errorData.details)) {
            // Afficher les erreurs de validation spécifiques
            errorData.details.forEach((detail: any) => {
              toast.error(`${detail.field}: ${detail.message}`);
            });
          } else {
            toast.error(errorData.error || "Échec de la validation");
          }
        } catch (parseError) {
          console.error("Échec du parsing de la réponse d'erreur:", parseError);
          toast.error("Échec de la validation");
        }
      } else if (error.response?.status === 409) {
        toast.error("Commande en double détectée. Veuillez patienter avant de créer une autre commande.");
      } else {
        console.log("🔍 Gestion de l'erreur générique...");
        toast.error("Échec de la création de la commande. Veuillez réessayer.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const addOrderProduct = async (
    orderId: string,
    productId: string,
    productQuantity: number
  ) => {
    try {
      console.log("️ Adding product to order:", {
        customerOrderId: orderId,
        productId,
        quantity: productQuantity
      });
      
      const response = await apiClient.post("/api/order-product", {
        customerOrderId: orderId,
        productId: productId,
        quantity: productQuantity,
      });

      console.log("📡 Product order response:", response);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Product order failed:", response.status, errorText);
        throw new Error(`Product order failed: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Product order successful:", data);
      
    } catch (error) {
      console.error("💥 Error creating product order:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (products.length === 0) {
      toast.error("Votre panier est vide");
      router.push("/cart");
    }
  }, [products.length, router]);

  return (
    <div className="bg-brand-bg-primary min-h-screen">
      <SectionTitle title="Checkout" path="Home | Cart | Checkout" />
      
      <main className="relative mx-auto grid max-w-screen-2xl grid-cols-1 gap-x-16 lg:grid-cols-2 lg:px-8 xl:gap-x-48 py-12">
        <h1 className="sr-only">Informations de commande</h1>

        {/* Order Summary */}
        <section
          aria-labelledby="summary-heading"
          className="bg-brand-bg-secondary px-4 pb-10 pt-16 sm:px-6 lg:col-start-2 lg:row-start-1 lg:px-0 lg:pb-16 shadow-sm rounded-lg"
        >
          <div className="mx-auto max-w-lg lg:max-w-none">
            <h2 id="summary-heading" className="text-2xl font-serif font-semibold text-brand-text-primary mb-6">
              Résumé de la commande
            </h2>

            <ul
              role="list"
              className="divide-y divide-gray-200 text-sm font-medium text-brand-text-primary mb-6"
            >
              {products.map((product) => (
                <li key={product?.id} className="flex items-start space-x-4 py-6">
                  <Image
                    src={getImageUrl(product?.image)}
                    alt={product?.title}
                    width={80}
                    height={80}
                    className="h-20 w-20 flex-none rounded-md object-cover object-center"
                  />
                  <div className="flex-auto space-y-1">
                    <h3 className="font-serif text-brand-text-primary">{product?.title}</h3>
                    <p className="text-brand-text-secondary">x{product?.amount}</p>
                  </div>
                  <p className="flex-none text-base font-medium text-brand-primary">
                    {formatPriceMRU(product?.price)}
                  </p>
                </li>
              ))}
            </ul>

            <dl className="space-y-4 border-t border-gray-200 pt-6 text-sm font-medium text-brand-text-primary">
              <div className="flex items-center justify-between border-t-2 border-brand-primary pt-4">
                <dt className="text-lg font-serif font-semibold text-brand-text-primary">Total</dt>
                <dd className="text-lg font-serif font-semibold text-brand-primary">
                  {formatPriceMRU(total)}
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <form className="px-4 pt-16 sm:px-6 lg:col-start-1 lg:row-start-1 lg:px-0">
          <div className="mx-auto max-w-lg lg:max-w-none">
            {/* Contact Information */}
            <section aria-labelledby="contact-info-heading">
              <h2
                id="contact-info-heading"
                className="text-2xl font-serif font-semibold text-brand-text-primary mb-6"
              >
                Informations de contact
              </h2>

              {/* Message informatif - Pas besoin de compte */}
              <div className="mt-4 p-4 bg-brand-accent/20 border border-brand-primary/30 rounded-md">
                <p className="text-sm text-brand-text-primary">
                  <strong className="text-brand-primary">💡 Pas besoin de créer un compte !</strong> Remplissez simplement vos coordonnées ci-dessous pour valider votre commande.
                </p>
              </div>

              <div className="mt-6">
                <label
                  htmlFor="name-input"
                  className="block text-sm font-medium text-brand-text-primary"
                >
                  Prénom * (min 2 caractères)
                </label>
                <div className="mt-1">
                  <input
                    value={checkoutForm.name}
                    onChange={(e) =>
                      setCheckoutForm({
                        ...checkoutForm,
                        name: e.target.value,
                      })
                    }
                    type="text"
                    id="name-input"
                    name="name-input"
                    autoComplete="given-name"
                    required
                    disabled={isSubmitting}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed text-brand-text-primary"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label
                  htmlFor="lastname-input"
                  className="block text-sm font-medium text-brand-text-primary"
                >
                  Nom * (min 2 caractères)
                </label>
                <div className="mt-1">
                  <input
                    value={checkoutForm.lastname}
                    onChange={(e) =>
                      setCheckoutForm({
                        ...checkoutForm,
                        lastname: e.target.value,
                      })
                    }
                    type="text"
                    id="lastname-input"
                    name="lastname-input"
                    autoComplete="family-name"
                    required
                    disabled={isSubmitting}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed text-brand-text-primary"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label
                  htmlFor="phone-input"
                  className="block text-sm font-medium text-brand-text-primary"
                >
                  Téléphone * (min 10 chiffres)
                </label>
                <div className="mt-1">
                  <input
                    value={checkoutForm.phone}
                    onChange={(e) =>
                      setCheckoutForm({
                        ...checkoutForm,
                        phone: e.target.value,
                      })
                    }
                    type="tel"
                    id="phone-input"
                    name="phone-input"
                    autoComplete="tel"
                    required
                    disabled={isSubmitting}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed text-brand-text-primary"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label
                  htmlFor="email-address"
                  className="block text-sm font-medium text-brand-text-primary"
                >
                  Email (optionnel)
                </label>
                <div className="mt-1">
                  <input
                    value={checkoutForm.email}
                    onChange={(e) =>
                      setCheckoutForm({
                        ...checkoutForm,
                        email: e.target.value,
                      })
                    }
                    type="email"
                    id="email-address"
                    name="email-address"
                    autoComplete="email"
                    disabled={isSubmitting}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed text-brand-text-primary"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label
                  htmlFor="country-select"
                  className="block text-sm font-medium text-brand-text-primary"
                >
                  Pays (optionnel)
                </label>
                <div className="mt-1">
                  <CountrySelect
                    value={checkoutForm.country}
                    onChange={(val) => setCheckoutForm({ ...checkoutForm, country: val })}
                    placeholder="Rechercher ou sélectionner un pays..."
                    disabled={isSubmitting}
                    id="country-select"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label
                  htmlFor="desired-delivery-date"
                  className="block text-sm font-medium text-brand-text-primary"
                >
                  Date souhaitée pour la livraison (optionnel)
                </label>
                <div className="mt-1">
                  <input
                    value={checkoutForm.desiredDeliveryDate}
                    onChange={(e) =>
                      setCheckoutForm({
                        ...checkoutForm,
                        desiredDeliveryDate: e.target.value,
                      })
                    }
                    type="date"
                    id="desired-delivery-date"
                    name="desired-delivery-date"
                    disabled={isSubmitting}
                    min={new Date().toISOString().split("T")[0]}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed text-brand-text-primary"
                  />
                </div>
              </div>
            </section>

            {/* Payment Notice */}
            <section className="mt-10">
              <div className="bg-brand-accent/20 border border-brand-primary/30 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-brand-primary" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-brand-text-primary">
                      Informations de paiement
                    </h3>
                    <div className="mt-2 text-sm text-brand-text-secondary">
                      <p>Le paiement sera traité après confirmation de la commande. Vous serez contacté pour les détails de paiement.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Order Notice */}
            <section aria-labelledby="order-notice-heading" className="mt-10">
              <h2
                id="order-notice-heading"
                className="text-2xl font-serif font-semibold text-brand-text-primary mb-6"
              >
                Notes de commande (optionnel)
              </h2>

              <div className="mt-6">
                <textarea
                  className="textarea textarea-bordered textarea-lg w-full disabled:bg-gray-100 disabled:cursor-not-allowed"
                  id="order-notice"
                  name="order-notice"
                  autoComplete="order-notice"
                  disabled={isSubmitting}
                  value={checkoutForm.orderNotice}
                  onChange={(e) =>
                    setCheckoutForm({
                      ...checkoutForm,
                      orderNotice: e.target.value,
                    })
                  }
                ></textarea>
              </div>
            </section>

            <div className="mt-10 border-t border-brand-primary/20 pt-6 ml-0">
              <button
                type="button"
                onClick={makePurchase}
                disabled={isSubmitting}
                className="w-full rounded-md border border-transparent bg-brand-secondary px-20 py-3 text-lg font-serif font-semibold text-white shadow-sm hover:bg-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 focus:ring-offset-brand-bg-primary transition-colors duration-300 sm:order-last disabled:bg-gray-400 disabled:cursor-not-allowed uppercase tracking-wider"
              >
                {isSubmitting ? "Traitement de la commande..." : "Valider la commande"}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CheckoutPage;
