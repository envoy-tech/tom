FROM quay.io/pypa/manylinux_2_28_x86_64

# Install Python 3.10.5
RUN dnf update -y && \
    dnf install -y epel-release && \
    dnf install -y gcc openssl-devel readline-devel bzip2-devel libffi-devel wget && \
    wget https://www.python.org/ftp/python/3.10.5/Python-3.10.5.tar.xz && \
    tar -xf Python-3.10.5.tar.xz && \
    cd Python-3.10.5 && \
    ./configure --enable-optimizations --enable-shared && \
    make -j 6 && \
    make altinstall

# Install OR-Tools
RUN dnf groupinstall -y 'Development Tools' && \
    dnf install -y redhat-lsb-core && \
    mkdir -p /root/install && \
    cd /root/install && \
    git clone https://github.com/google/or-tools.git && \
    cd or-tools && \
    cmake -S . -Bbuild -DBUILD_DEPS=ON -DBUILD_SAMPLES=OFF -DBUILD_EXAMPLES=OFF && \
    cmake --build build --config Release --target install

# Install Catch2
RUN git clone https://github.com/catchorg/Catch2.git && \
    cd Catch2 && \
    cmake -S . -Bbuild -DBUILD_TESTING=OFF && \
    cmake --build build --config Release --target install
