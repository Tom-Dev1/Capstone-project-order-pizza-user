interface FormModalProps {
    isVisible: boolean;
}

const FormModal: React.FC<FormModalProps> = ({ isVisible }) => {
    return (
        <>
            {isVisible && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-lg font-semibold">Form Modal</h2>
                        <p>This is the content of the modal.</p>
                    </div>
                </div>
            )}
        </>
    );
};

export default FormModal;
