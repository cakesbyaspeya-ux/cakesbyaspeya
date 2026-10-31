// Inside handlePlaceOrder function in app/checkout/summary/page.tsx

    const payload = {
      customer_name: info.name,
      phone: info.phone,
      whatsapp: info.whatsapp,
      delivery_method: info.method,
      delivery_date: info.date,
      preferred_time: info.time,
      area: info.area,
      address: info.address,
      pickup_location: info.pickup_location, // 👈 New
      special_instructions: info.instructions,
      cake_message: info.cake_message,       // 👈 New
      delivery_fee: info.delivery_fee,       // 👈 New
      
      promo_code: promoCode,
      discount_amount: discountAmount,
      final_total: total + info.delivery_fee, // Include delivery fee in final total
      
      items: items.map(it => ({
        product_id: it.product_id, 
        product_name: it.product_name, 
        design_id: it.design_id,
        design_label: it.design_label, 
        image: it.image, 
        custom_design_url: it.custom_design_url,
        flavour: it.flavour, 
        size_label: it.size_label, 
        cake_message: it.cake_message, // This handles per-item messages (like from old carts)
        unit_price: it.unit_price, 
        qty: it.qty,
      })),
      upsells: upsells.map(u => ({ 
        id: u.id, name: u.name, price: u.price, qty: u.qty 
      }))
    };