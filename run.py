from app import create_app, socket

if __name__ == '__main__':
    app = create_app()
    socket.run(app, '0.0.0.0', port='5000', debug=True)
