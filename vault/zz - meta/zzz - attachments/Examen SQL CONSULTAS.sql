-- ¿Cuál es el monto total pagado por cada cliente?
-- Debes mostrar el nombre y apellido de cada clientes, así como la suma total de los pagos que ha realizado.  --

SELECT CONCAT(nombre," ",apellidos)AS "Nombre completo" ,SUM(p.monto_pago) AS "Total Pagado" FROM clientes c, reservas r
JOIN pagos p WHERE r.id_cliente = c.id_cliente
GROUP BY c.id_cliente;

-- Ejercicio 2--
/** ¿Cuáles son los destinos más reservados?
Se debe de mostrar el nombre del destino, así como las veces que dicho destino ha sido reservado. Se mostrarán en primer lugar los destinos más reservados. **/
-- INCOMPLETO -- 
SELECT COUNT(id_reserva) AS "Número de veces reservado un destino", d.nombre_destino FROM reservas r , paquetes p
JOIN destinos d WHERE p.id_paquete = r.id_paquete
GROUP BY d.nombre_destino;


-- Ejercicio 3 --
/**Muestra las veces que se ha reservado cada paquete, y calcula el número de personas totales que irán a ese viaje.**/
SELECT COUNT(*) AS "Veces reservado",SUM(cantidad_personas) AS "Asistentes" ,id_paquete FROM reservas
GROUP BY id_paquete
