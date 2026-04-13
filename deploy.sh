#!/bin/bash

# Leer el estado actual
source ~/current_deploy.env

echo "Color activo actual: $ACTIVE_COLOR"

# Determinar el color opuesto
if [ "$ACTIVE_COLOR" = "blue" ]; then
    TARGET_COLOR="green"
    TARGET_PORT=3002
    ACTIVE_PORT=3001
else
    TARGET_COLOR="blue"
    TARGET_PORT=3001
    ACTIVE_PORT=3002
fi

echo "Desplegando en: $TARGET_COLOR (puerto $TARGET_PORT)"

# Detener y eliminar el contenedor objetivo
docker stop app-$TARGET_COLOR || true
docker rm app-$TARGET_COLOR || true

# Desplegar el nuevo contenedor
docker pull ghcr.io/eunn09/example-node:master
docker run -d \
    --name app-$TARGET_COLOR \
    -p $TARGET_PORT:3000 \
    --restart always \
    ghcr.io/eunn09/example-node:master

echo "Contenedor app-$TARGET_COLOR corriendo en puerto $TARGET_PORT"

# Cambiar el tráfico de Nginx usando envsubst
export ACTIVE_PORT=$TARGET_PORT
envsubst '${ACTIVE_PORT}' < ~/nginx-templates/blue-green.conf.template | sudo tee /etc/nginx/sites-available/blue-green

# Recargar Nginx
sudo nginx -t && sudo systemctl reload nginx

# Guardar el nuevo estado
echo "ACTIVE_COLOR=$TARGET_COLOR" > ~/current_deploy.env

echo "✅ Despliegue completado. Ahora activo: $TARGET_COLOR"
