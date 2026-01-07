import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { SeleccionMesa } from '../../components/cliente/SeleccionMesa';
import { MenuDigital } from '../../components/cliente/MenuDigital';
import { RevisarPedido } from '../../components/cliente/RevisarPedido';
import { EstadoPedido } from '../../components/cliente/EstadoPedido';
import { ItemCarrito, Producto } from '../../types/restaurant'; // Kept these as they are used
import { Mesa } from '../../types/restaurant.types'; // Changed this line as per instruction
import { toast, Toaster } from '../../components/ui/sonner';
import { tableService } from '../../services/tableService';
import { productService } from '../../services/productService';
import { orderService } from '../../services/orderService';

type Pantalla = 'seleccion-mesa' | 'menu' | 'revisar-pedido' | 'estado-pedido';

export default function ClientePage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const mesaParam = searchParams.get('mesa');

    // Data from API
    const [mesas, setMesas] = useState<Mesa[]>([]);
    const [productos, setProductos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(true);

    // Si viene mesa por QR, saltar directo al menú
    const [pantallaActual, setPantallaActual] = useState<Pantalla>(
        mesaParam ? 'menu' : 'seleccion-mesa'
    );

    const [mesaSeleccionada, setMesaSeleccionada] = useState<number | null>(
        mesaParam ? parseInt(mesaParam) : null
    );

    const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
    // const [metodoPagoSeleccionado, setMetodoPagoSeleccionado] = useState<string>(''); // Removed unused state
    const [currentOrderId, setCurrentOrderId] = useState<string>('');
    const [fechaCreacionPedido, setFechaCreacionPedido] = useState<string>('');

    // Cargar datos del backend
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [tablesData, productsData] = await Promise.all([
                    tableService.getAll(),
                    productService.getAvailable(),
                ]);

                // Mapear a formato esperado por componentes (ya viene en español del servicio)
                setMesas(tablesData);

                setProductos(productsData.map(p => ({
                    id: parseInt(p.id),
                    nombre: p.nombre,
                    descripcion: p.descripcion || '',
                    precio: p.precio,
                    categoria: p.categoria,
                    imagen: p.imagen,
                })));
            } catch (err) {
                console.error('Error cargando datos:', err);
                toast.error('Error al cargar datos del servidor');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // Validar mesa del QR
    useEffect(() => {
        if (mesaParam && mesas.length > 0) {
            const mesaNum = parseInt(mesaParam);

            // Validar que sea un número válido
            if (isNaN(mesaNum) || mesaNum < 1 || mesaNum > 50) {
                toast.error('Número de mesa inválido');
                navigate('/cliente');
                return;
            }

            // Validar que la mesa exista
            const mesaExiste = mesas.find(m => m.numero === mesaNum);
            if (!mesaExiste) {
                toast.error(`Mesa ${mesaNum} no encontrada`);
                navigate('/cliente');
                return;
            }

            setMesaSeleccionada(mesaNum);
            setPantallaActual('menu');
            toast.success(`Bienvenido a Mesa ${mesaNum}`);
        }
    }, [mesaParam, navigate, mesas]);

    // Handlers para Selección de Mesa
    const handleSeleccionarMesa = (numeroMesa: number) => {
        setMesaSeleccionada(numeroMesa);
        setPantallaActual('menu');
    };

    const handleActualizarMesas = () => {
        console.log('Actualizando mesas...');
    };

    // Handlers para el Menú
    const handleAgregarAlCarrito = (producto: Producto) => {
        setCarrito(prev => {
            const itemExistente = prev.find(item => item.producto.id === producto.id);

            if (itemExistente) {
                return prev.map(item =>
                    item.producto.id === producto.id
                        ? { ...item, cantidad: item.cantidad + 1 }
                        : item
                );
            }

            return [...prev, { producto, cantidad: 1 }];
        });
    };

    const handleRemoverDelCarrito = (productoId: number) => {
        setCarrito(prev => {
            const itemExistente = prev.find(item => item.producto.id === productoId);

            if (!itemExistente) return prev;

            if (itemExistente.cantidad === 1) {
                return prev.filter(item => item.producto.id !== productoId);
            }

            return prev.map(item =>
                item.producto.id === productoId
                    ? { ...item, cantidad: item.cantidad - 1 }
                    : item
            );
        });
    };

    const handleIrARevisarPedido = () => {
        setPantallaActual('revisar-pedido');
    };

    const handleVolverAlMenu = () => {
        setPantallaActual('menu');
    };

    const handleVolverAMesas = () => {
        setMesaSeleccionada(null);
        setCarrito([]);
        // setPedidoConfirmado(false);
        // Si vino por QR, redirigir a /cliente sin parámetros
        navigate('/cliente');
        setPantallaActual('seleccion-mesa');
    };

    // Handlers para Revisar Pedido
    const handleEliminarItem = (productoId: number) => {
        setCarrito(prev => prev.filter(item => item.producto.id !== productoId));
    };

    const handleConfirmarPedido = async () => {
        if (!mesaSeleccionada) return;

        try {
            // Crear orden en el backend
            const newOrder = await orderService.create({
                numeroMesa: mesaSeleccionada,
                personas: 1, // Default, podría pedirse
                items: carrito.map(item => ({
                    productoId: item.producto.id,
                    cantidad: item.cantidad,
                    observaciones: ''
                }))
            });

            setCurrentOrderId(newOrder.id);
            setFechaCreacionPedido(newOrder.fechaCreacion); // Guardar fecha de creación
            setPantallaActual('estado-pedido'); // Ir directo al seguimiento
            console.log('Pedido creado:', newOrder);
            toast.success('Pedido enviado a cocina');
        } catch (error) {
            console.error('Error al crear pedido:', error);
            toast.error('Error al enviar el pedido. Intente nuevamente.');
        }
    };



    // Calcular total
    const calcularTotal = () => {
        const subtotal = carrito.reduce((sum, item) => sum + (item.producto.precio * item.cantidad), 0);
        const propina = subtotal * 0.10;
        return subtotal + propina;
    };

    // Handler para Liberar Mesa
    const handleReleaseTable = async () => {
        if (!mesaSeleccionada) return;
        try {
            await tableService.releaseTable(mesaSeleccionada);
            toast.success('Gracias por su visita. Mesa liberada.');
            handleVolverAMesas();
        } catch (error) {
            console.error('Error al liberar mesa:', error);
            toast.error('Error al liberar la mesa');
        }
    };

    return (
        <>
            <Toaster />
            {pantallaActual === 'seleccion-mesa' && !loading && (
                <SeleccionMesa
                    mesas={mesas}
                    onSeleccionarMesa={handleSeleccionarMesa}
                    onActualizar={handleActualizarMesas}
                />
            )}

            {pantallaActual === 'menu' && mesaSeleccionada !== null && !loading && (
                <MenuDigital
                    productos={productos}
                    carrito={carrito}
                    onAgregarAlCarrito={handleAgregarAlCarrito}
                    onRemoverDelCarrito={handleRemoverDelCarrito}
                    onIrARevisarPedido={handleIrARevisarPedido}
                    numeroMesa={mesaSeleccionada}
                    onVolverAMesas={handleVolverAMesas}
                />
            )}

            {pantallaActual === 'revisar-pedido' && mesaSeleccionada !== null && (
                <RevisarPedido
                    carrito={carrito}
                    numeroMesa={mesaSeleccionada}
                    onVolverAlMenu={handleVolverAlMenu}
                    onConfirmarPedido={handleConfirmarPedido}
                    onAgregarCantidad={(productoId) => {
                        const producto = carrito.find(i => i.producto.id === productoId)?.producto;
                        if (producto) handleAgregarAlCarrito(producto);
                    }}
                    onRemoverCantidad={handleRemoverDelCarrito}
                    onEliminarItem={handleEliminarItem}
                />
            )}



            {pantallaActual === 'estado-pedido' && mesaSeleccionada !== null && (
                <EstadoPedido
                    orderId={currentOrderId}
                    numeroMesa={mesaSeleccionada}
                    items={carrito}
                    total={calcularTotal()}
                    fechaCreacionPedido={fechaCreacionPedido}
                    onVolverAlMenu={handleVolverAlMenu}
                    onLiberarMesa={handleReleaseTable}
                />
            )}


        </>
    );
}
