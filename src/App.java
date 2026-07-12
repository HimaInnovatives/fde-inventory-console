import java.util.ArrayList;
import java.util.Scanner;

public class App {
    public static void main(String[] args) {
        ArrayList<String> inventory = new ArrayList<>();
        Scanner scanner = new Scanner(System.in);
        boolean running = true;

        System.out.println("=== FDE Local Inventory System Live ===");

        while (running) {
            System.out.println("\nSelect an option: 1) Add Item  2) View Inventory  3) Exit");
            System.out.print("Enter choice: ");
            int choice = scanner.nextInt();
            scanner.nextLine(); // Clear the text buffer

            if (choice == 1) {
                System.out.print("Enter product name to add: ");
                String item = scanner.nextLine();
                inventory.add(item);
                System.out.println("✔ " + item + " added successfully!");
            } else if (choice == 2) {
                System.out.println("\n--- Current Inventory List ---");
                if (inventory.isEmpty()) {
                    System.out.println("[Inventory is currently empty]");
                } else {
                    for (int i = 0; i < inventory.size(); i++) {
                        System.out.println((i + 1) + ". " + inventory.get(i));
                    }
                }
            } else if (choice == 3) {
                running = false;
                System.out.println("Exiting system. Goodbye!");
            } else {
                System.out.println("Invalid choice. Try again.");
            }
        }
        scanner.close();
    }
}