#!/bin/bash

# Install nvm (Node Version Manager)
echo "Installing nvm..."
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

# Source nvm script to use it in the current shell session
echo "Sourcing nvm script..."
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

# Install Node.js version 22
echo "Installing Node.js v22..."
nvm install 22

# Verify Node.js installation
echo "Verifying Node.js installation..."
node -v
nvm current

# Verify npm installation
echo "Verifying npm installation..."
npm -v

# Run npm install
echo "Running npm install..."
npm install

echo "Setup completed!"
